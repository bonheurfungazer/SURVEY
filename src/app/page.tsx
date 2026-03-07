'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { verifyAdminCredentials, fetchSensitiveAdminData, checkAdminAuthStatus, logoutAdmin } from './actions'

export default function Home() {
  const [currentTab, setCurrentTab] = useState('home')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [voteSuccess, setVoteSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [adminUsername, setAdminUsername] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdminAuthenticating, setIsAdminAuthenticating] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const [voteForm, setVoteForm] = useState({
    country: 'Cameroun',
    countryCode: 'CM',
    model: 'Claude 3.5 Sonnet',
    intensity: 8,
    useCase: '',
    contact: ''
  })

  const [adminStats, setAdminStats] = useState({
    totalVotes: 0,
    activeUsers: 0,
    reelsPercentage: 0,
    generatedPercentage: 0,
    countries: [] as Array<{ name: string; flag: string; count: number; percent: number }>,
    latestVotes: [] as Array<{ user: string; flag: string; model: string; time: string; real: boolean }>,
    contacts: [] as Array<{ id: string; contact: string; country: string; model: string; date: string }>,
    chartData: { realLine: "M0,90 Q40,90 80,90 T150,90 T250,90 T300,90", genLine: "M0,90 Q40,90 80,90 T150,90 T250,90 T300,90" }
  })

  const exportContactsCSV = () => {
    if (adminStats.contacts.length === 0) return;

    // Create CSV content
    const headers = ["Date", "Pays", "Modèle Choisi", "Contact (WhatsApp/Email)"];
    const rows = adminStats.contacts.map(c => [
        `"${c.date}"`,
        `"${c.country}"`,
        `"${c.model}"`,
        `"${c.contact || 'Non renseigné'}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `contacts_votes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    const init = async () => {
      // Check normal user auth state (Google)
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)

      // Check admin auth state securely via server action
      const isAdmin = await checkAdminAuthStatus()
      setIsAdminAuthenticated(isAdmin)

      // Listen for normal auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
      })

      fetchAdminStats()

      // If admin is already authenticated on load, fetch sensitive data
      if (isAdmin) {
        fetchSensitiveAdminData().then(sensitiveData => {
            if (sensitiveData && sensitiveData.stats) {
                // Remplacer complètement les statistiques par les vraies données admin
                const formattedLatestVotes = sensitiveData.stats.latestVotes.map((v: any) => ({
                    user: v.user,
                    flag: getFlagEmoji(v.country_code),
                    model: v.model,
                    time: v.time,
                    real: v.real
                }))

                const formattedCountries = sensitiveData.stats.countries.map((c: any) => ({
                    name: c.name,
                    flag: getFlagEmoji(c.code),
                    count: c.count,
                    percent: c.percent
                }))

                setAdminStats(prev => ({
                    ...prev,
                    totalVotes: sensitiveData.stats.totalVotes,
                    activeUsers: sensitiveData.stats.activeUsers,
                    reelsPercentage: sensitiveData.stats.reelsPercentage,
                    generatedPercentage: sensitiveData.stats.generatedPercentage,
                    countries: formattedCountries,
                    latestVotes: formattedLatestVotes,
                    contacts: sensitiveData.contacts.slice(0, 50),
                    chartData: sensitiveData.stats.chartData || prev.chartData
                }));
            }
        }).catch(e => {
            console.error("Admin session expired or invalid", e)
            setIsAdminAuthenticated(false)
        })
      }
      const channel = subscribeToVotes()

      return () => {
        authListener.subscription.unsubscribe()
        if (channel) {
          supabase.removeChannel(channel)
        }
      }
    }
    init()
  }, [])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)

    try {
        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email: loginEmail,
                password: loginPassword,
            })
            if (error) throw error

            // Si la vérification par email est activée sur Supabase, l'utilisateur est créé mais pas connecté
            if (data.user && data.user.identities && data.user.identities.length === 0) {
                showToast("Cet email est déjà utilisé. Veuillez vous connecter.", "error")
            } else if (data.session === null) {
                showToast("Inscription réussie ! Veuillez vérifier votre boîte mail pour confirmer votre compte.")
                setShowLoginModal(false)
            } else {
                showToast("Inscription réussie ! Vous pouvez maintenant voter.")
                setShowLoginModal(false)
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            })
            if (error) throw error
            showToast("Connexion réussie !")
            setShowLoginModal(false)
        }
    } catch (error: any) {
        console.error('Error with auth:', error)
        showToast(error.message || "Erreur d'authentification.", 'error')
    } finally {
        setIsLoggingIn(false)
    }
  }

  const logout = async () => {
    // Normal user logout
    await supabase.auth.signOut()
    setUser(null)

    // Admin user logout
    await logoutAdmin()
    setIsAdminAuthenticated(false)
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdminAuthenticating(true)

    try {
      // Vérification côté serveur pour ne pas exposer les mots de passe dans le code client
      const isAuthenticated = await verifyAdminCredentials(adminUsername, adminPassword);

      if (isAuthenticated) {
        setIsAdminAuthenticated(true)
        showToast("Connexion administrateur réussie !")
        setAdminUsername('')
        setAdminPassword('')

        // Fetch sensitive data (contacts) only after successful login (cookie is set)
        const sensitiveData = await fetchSensitiveAdminData();
        if (sensitiveData && sensitiveData.contacts) {
            setAdminStats(prev => ({
                ...prev,
                contacts: sensitiveData.contacts.slice(0, 50)
            }));
        }
        if (sensitiveData && sensitiveData.stats) {
            // Remplacer complètement les statistiques par les vraies données admin
            const formattedLatestVotes = sensitiveData.stats.latestVotes.map((v: any) => ({
                user: v.user,
                flag: getFlagEmoji(v.country_code),
                model: v.model,
                time: v.time,
                real: v.real
            }));

            setAdminStats(prev => ({
                ...prev,
                totalVotes: sensitiveData.stats.totalVotes,
                activeUsers: sensitiveData.stats.activeUsers,
                reelsPercentage: sensitiveData.stats.reelsPercentage,
                generatedPercentage: sensitiveData.stats.generatedPercentage,
                countries: sensitiveData.stats.countries.map((c: any) => ({...c, flag: getFlagEmoji(c.code)})),
                latestVotes: formattedLatestVotes,
                chartData: sensitiveData.stats.chartData || prev.chartData
            }));
        }
      } else {
        throw new Error("Identifiants invalides")
      }
    } catch (error: any) {
      console.error('Admin login error:', error)
      showToast("Identifiants incorrects.", 'error')
    } finally {
      setIsAdminAuthenticating(false)
    }
  }

  const submitVote = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      showToast("Vous devez être connecté pour voter.", 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('votes')
        .insert([
          {
            user_id: user.id,
            country: voteForm.country,
            country_code: voteForm.countryCode,
            model_choice: voteForm.model,
            intensity: voteForm.intensity,
            use_case: voteForm.useCase,
            contact_info: voteForm.contact,
            is_real_user: true
          }
        ])

      if (error) {
        if (error.code === '23505') {
          throw new Error("Vous avez déjà voté ! Un seul vote par compte est autorisé.")
        }
        throw error
      }

      setVoteSuccess(true)
      showToast("Votre vote a bien été enregistré !")

      setTimeout(() => {
        setVoteSuccess(false)
        setCurrentTab('home')
        setVoteForm(prev => ({
          ...prev,
          intensity: 8,
          useCase: '',
          contact: ''
        }))
        fetchAdminStats()
      }, 2000)

    } catch (error: any) {
      console.error('Error submitting vote:', error)
      showToast(error.message || "Erreur lors de l'enregistrement de votre vote.", 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchAdminStats = async () => {
    try {
      const { data: globalStats, error: globalErr } = await supabase
        .from('admin_stats')
        .select('*')
        .limit(1)
        .single()

      if (!globalErr && globalStats) {
        setAdminStats(prev => ({
          ...prev,
          totalVotes: globalStats.total_votes || 0,
          activeUsers: globalStats.active_users_24h || 0,
          reelsPercentage: globalStats.real_users_percent !== null ? Math.round(globalStats.real_users_percent) : 0,
          generatedPercentage: globalStats.real_users_percent !== null ? 100 - Math.round(globalStats.real_users_percent) : 0
        }))
      }

      const { data: countryData, error: countryErr } = await supabase.rpc('get_top_countries')

      if (!countryErr && countryData && countryData.length > 0) {
        setAdminStats(prev => ({
          ...prev,
          countries: countryData.map((c: any) => ({
            name: c.country_name,
            count: c.vote_count,
            percent: parseFloat(c.percentage),
            flag: getFlagEmoji(c.country_code)
          }))
        }))
      }

      // Fetch all votes today to calculate chart
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      // Pour des raisons de sécurité, nous ne récupérons PAS les contact_info
      // sans être authentifié en tant qu'administrateur.
      // Le composant fetchera les contacts uniquement via la Server Action `fetchSensitiveAdminData`
      // une fois le login passé.

      const { data: recentData } = await supabase
        .from('votes')
        .select('id, country_code, model_choice, is_real_user, created_at, country')
        .order('created_at', { ascending: false })
        .limit(100)

      if (recentData && recentData.length > 0) {
        // Calculate chart line points
        // Get votes from the last 24h, group by hour for the chart
        const chartVotes = recentData.slice().reverse() // chronological order

        // Simple logic to distribute points across the X axis (0 to 300)
        // Y axis goes from 90 (bottom) to 10 (top)

        let realVotesCount = 0;
        let genVotesCount = 0;

        // Let's create an array of points for the paths
        const realPoints: {x: number, y: number}[] = [{x: 0, y: 90}]
        const genPoints: {x: number, y: number}[] = [{x: 0, y: 90}]

        const totalVotesChart = chartVotes.length;
        const width = 300;

        chartVotes.forEach((v, idx) => {
            const x = Math.round((idx + 1) * (width / totalVotesChart));
            if (v.is_real_user) {
                realVotesCount++;
            } else {
                genVotesCount++;
            }

            // Normalize Y based on max possible votes in this set to fit the chart (between 90 and 10)
            const realY = 90 - (Math.min(realVotesCount / totalVotesChart, 1) * 80);
            const genY = 90 - (Math.min(genVotesCount / totalVotesChart, 1) * 80);

            realPoints.push({x, y: realY});
            genPoints.push({x, y: genY});
        });

        // Function to convert points to an SVG path curve
        const generatePath = (points: {x: number, y: number}[]) => {
            if (points.length === 0) return "M0,90";
            if (points.length === 1) return `M${points[0].x},${points[0].y}`;
            if (points.length === 2) return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`;

            let path = `M${points[0].x},${points[0].y}`;
            for (let i = 1; i < points.length - 1; i++) {
                const xc = (points[i].x + points[i + 1].x) / 2;
                const yc = (points[i].y + points[i + 1].y) / 2;
                path += ` Q${points[i].x},${points[i].y} ${xc},${yc}`;
            }
            // Curve to the last point
            path += ` T${points[points.length - 1].x},${points[points.length - 1].y}`;
            return path;
        };

        const realLineStr = generatePath(realPoints);
        const genLineStr = generatePath(genPoints);

        setAdminStats(prev => ({
          ...prev,
          latestVotes: recentData.slice(0, 3).map(v => ({
            user: 'usr_' + v.id.substring(0, 5),
            flag: getFlagEmoji(v.country_code),
            model: v.model_choice,
            time: "A l'instant",
            real: v.is_real_user
          })),
          chartData: { realLine: realLineStr, genLine: genLineStr }
        }))
      }

    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const subscribeToVotes = () => {
    const channel = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'votes' },
        (payload) => {
          console.log('Nouveau vote en temps réel!', payload)

          setAdminStats(prev => {
              const newVote = {
                  user: 'usr_' + payload.new.id.substring(0, 5),
                  flag: getFlagEmoji(payload.new.country_code),
                  model: payload.new.model_choice,
                  time: "A l'instant",
                  real: payload.new.is_real_user
              }
              const newLatest = [newVote, ...prev.latestVotes].slice(0, 3)

              // Mettre à jour la répartition par pays en direct
              // ATTENTION : L'admin est connecté (il ne voit que les vrais). Si un "faux" vote arrive (is_real_user=false), l'admin ne doit pas le voir.
              if (isAdminAuthenticated && !payload.new.is_real_user) {
                  return prev; // On ignore la mise à jour pour l'admin car c'est un faux vote
              }

              let countryFound = false;
              const newCountries = prev.countries.map(c => {
                  if (c.name === payload.new.country) {
                      countryFound = true;
                      return { ...c, count: c.count + 1 };
                  }
                  return c;
              });

              if (!countryFound && payload.new.country) {
                  newCountries.push({
                      name: payload.new.country,
                      flag: getFlagEmoji(payload.new.country_code),
                      count: 1,
                      percent: 0 // Will be recalculated below
                  });
              }

              // Recalculer les pourcentages des pays
              const totalV = prev.totalVotes + 1;
              const recalculatedCountries = newCountries
                  .map(c => ({ ...c, percent: parseFloat(((c.count / totalV) * 100).toFixed(1)) }))
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 4);

              return {
                  ...prev,
                  totalVotes: totalV,
                  latestVotes: newLatest,
                  countries: recalculatedCountries
                  // Note: The chart SVG path is not trivially recalculable here without full history,
                  // so it remains static until the next full refresh, but counters and bars update.
              }
          })
        }
      )
      .subscribe()
    return channel
  }

  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode) return '🏳️'
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.options[e.target.selectedIndex].dataset.code || ''
    setVoteForm(prev => ({ ...prev, country: e.target.value, countryCode: code }))
  }

  return (
    <div className="max-w-md mx-auto min-h-screen relative bg-[#0B121A] overflow-hidden pb-20">

      {/* Toast Notification */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111823] border border-[#1E293B] rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
                <button
                    onClick={() => setShowLoginModal(false)}
                    className="absolute top-4 right-4 text-[#94A3B8] hover:text-white transition-colors"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>
                <h2 className="text-2xl font-bold text-white mb-2 text-center">
                    {isSignUp ? 'Créer un compte' : 'Connexion'}
                </h2>
                <p className="text-[#94A3B8] text-sm text-center mb-6">
                    {isSignUp ? 'Inscrivez-vous pour voter et participer au choix du prochain modèle.' : 'Connectez-vous pour continuer.'}
                </p>
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i className="fas fa-envelope text-[#94A3B8]/70 text-sm"></i>
                            </div>
                            <input
                                type="email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="w-full bg-[#1A2332] border border-white/5 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#3B82F6]/50"
                                placeholder="Adresse email"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i className="fas fa-lock text-[#94A3B8]/70 text-sm"></i>
                            </div>
                            <input
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full bg-[#1A2332] border border-white/5 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#3B82F6]/50"
                                placeholder="Mot de passe"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)] mt-2 flex items-center justify-center space-x-2"
                    >
                        {isLoggingIn ? (
                            <span>Patientez... <i className="fas fa-spinner fa-spin ml-2"></i></span>
                        ) : (
                            <span>{isSignUp ? "S'inscrire" : "Se connecter"}</span>
                        )}
                    </button>
                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-xs text-[#94A3B8] hover:text-white transition-colors"
                        >
                            {isSignUp ? 'Déjà un compte ? Connectez-vous' : "Pas de compte ? S'inscrire"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {toastMessage && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-bold min-w-[300px] transition-opacity duration-300 ${toastType === 'success' ? 'bg-[#10B981] text-white' : 'bg-[#EF4444] text-white'}`}>
            <i className={`fas ${toastType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{toastMessage}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex space-x-2 bg-[#111823]/90 backdrop-blur-md px-6 py-3 rounded-full border border-[#1E293B] shadow-lg">
          <button onClick={() => setCurrentTab('home')} className={`p-2 transition-colors duration-200 ${currentTab === 'home' ? 'text-[#3B82F6]' : 'text-[#94A3B8]'}`}>
              <i className="fas fa-home text-lg"></i>
          </button>
          <button onClick={() => setCurrentTab('vote')} className={`p-2 transition-colors duration-200 ${currentTab === 'vote' ? 'text-[#3B82F6]' : 'text-[#94A3B8]'}`}>
              <i className="fas fa-vote-yea text-lg"></i>
          </button>
          <button onClick={() => setCurrentTab('admin')} className={`p-2 transition-colors duration-200 ${currentTab === 'admin' ? 'text-[#3B82F6]' : 'text-[#94A3B8]'}`}>
              <i className="fas fa-chart-line text-lg"></i>
          </button>
      </div>

      {/* Home View */}
      {currentTab === 'home' && (
        <div className="w-full min-h-screen relative">
            <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-20 bg-[#0B121A]/80 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-[#111823] border border-[#1E293B] flex items-center justify-center text-[#3B82F6] text-sm font-bold">
                        &lt;&gt;
                    </div>
                    <span className="font-bold text-lg tracking-tight">L'API Unifiée</span>
                </div>
                {!user ? (
                    <button onClick={() => {setShowLoginModal(true); setIsSignUp(false);}} className="text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors flex items-center space-x-2">
                        <i className="fas fa-sign-in-alt"></i>
                        <span>Connexion</span>
                    </button>
                ) : (
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#111823] overflow-hidden border border-[#1E293B] flex items-center justify-center text-[#94A3B8]">
                            <i className="fas fa-user text-sm"></i>
                        </div>
                        <button onClick={logout} className="text-xs font-semibold text-[#94A3B8] hover:text-[#EF4444] transition-colors">
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                )}
            </div>

            <div className="relative px-6 pt-6 pb-12 overflow-hidden flex flex-col items-center">
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-[#10B981]/20 rounded-full blur-[80px] z-0 pointer-events-none"></div>

                <div className="glass-hero w-full rounded-3xl p-8 relative z-10 flex flex-col items-center text-center overflow-hidden">
                    <div className="perspective-grid"></div>

                    <div className="bg-[#047857]/30 border border-[#10B981]/30 text-[#10B981] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center mb-8 tracking-widest relative z-10 uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <i className="fas fa-bolt mr-1.5"></i> Latence Record : &lt; 50ms
                    </div>

                    <h1 className="text-3xl font-extrabold leading-tight mb-8 relative z-10 tracking-tight">
                        Accédez aux<br/>derniers<br/>modèles<br/>Claude, Gemini<br/>et ChatGPT <span className="text-blue-gradient">via</span><br/>
                        <span className="text-blue-gradient">API</span> à <span className="text-blue-gradient">-80%</span> du<br/>prix officiel
                    </h1>

                    {!user ? (
                        <button onClick={() => {setShowLoginModal(true); setIsSignUp(true);}} className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-4 rounded-xl text-sm transition-colors relative z-10 btn-primary-glow mb-8 flex items-center justify-center space-x-2">
                            <i className="fas fa-user-plus"></i>
                            <span>Créer un compte pour voter</span>
                        </button>
                    ) : (
                        <button onClick={() => setCurrentTab('vote')} className="w-full bg-[#10B981] hover:bg-[#047857] text-white font-bold py-4 rounded-xl text-sm transition-colors relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.4)] mb-8 flex items-center justify-center space-x-2">
                            <span>Voter maintenant</span>
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    )}

                    <div className="flex items-center justify-center space-x-4 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-[#111823] border border-[#94A3B8]/30 flex items-center justify-center logo-glow-anthropic">
                            <span className="text-2xl font-black text-white" style={{fontFamily: 'serif'}}>A|</span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-[#111823] border border-[#94A3B8]/30 flex items-center justify-center logo-glow-google">
                            <i className="fab fa-google text-2xl" style={{background: 'conic-gradient(from -45deg, #ea4335 110deg, #4285f4 90deg 180deg, #34a853 180deg 270deg, #fbbc05 270deg) 73% 55%/150% 150% no-repeat', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent'}}></i>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-[#111823] border border-[#94A3B8]/30 flex items-center justify-center logo-glow-openai">
                            <i className="fas fa-asterisk text-2xl text-[#10B981]"></i>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center flex flex-col items-center">
                    <span className="text-[10px] text-[#94A3B8] uppercase tracking-[0.2em] font-bold mb-1">Votes Enregistrés</span>
                    <h2 className="text-5xl font-black tracking-tighter">12 458</h2>
                    <div className="w-12 h-1 bg-[#3B82F6] rounded-full mt-3"></div>
                </div>
            </div>

            <div className="px-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Dernières activités</h3>
                    <div className="bg-[#047857]/30 border border-[#10B981]/30 text-[#10B981] text-[9px] font-bold px-2 py-1 rounded flex items-center tracking-wider uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5 animate-pulse"></div>
                        En direct
                    </div>
                </div>

                <div className="space-y-3">
                    {adminStats.latestVotes.length > 0 ? adminStats.latestVotes.map((vote, index) => (
                        <div key={index} className="bg-[#111823]/50 border border-[#1E293B] p-4 rounded-xl flex items-start">
                            <div className="w-10 h-10 rounded-lg bg-[#1E293B] flex items-center justify-center mr-4 shrink-0 text-xl shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
                                <span>{vote.flag}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-sm flex items-center space-x-2">
                                        <span>Nouveau vote</span>
                                    </h4>
                                    <span className="text-[#64748B] text-xs">{vote.time}</span>
                                </div>
                                <p className="text-[#94A3B8] text-xs leading-relaxed">
                                    Un utilisateur a voté pour <span className="text-white font-semibold">{vote.model}</span>.
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-[#94A3B8] text-sm py-4">Aucun vote pour l'instant</div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Vote View */}
      {currentTab === 'vote' && (
        <div className="w-full min-h-screen relative bg-gradient-to-b from-[#132238] to-[#0A1118]">
            <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <button onClick={() => setCurrentTab('home')} className="text-white hover:text-white transition-colors">
                    <i className="fas fa-chevron-left text-lg"></i>
                </button>
                <span className="font-bold text-sm tracking-tight text-white">Vote & Comparatif</span>
                <div className="w-4"></div>
            </div>

            <div className="px-6 pt-4 pb-24">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Votez le prochain LLM</h1>
                    <p className="text-sm text-[#94A3B8] leading-relaxed max-w-[280px] mx-auto">
                        Aidez-nous à choisir le prochain modèle à intégrer à notre API unifiée à -80%.
                    </p>
                </div>

                <div className="bg-[#111823] border border-white/5 rounded-[24px] p-5 mb-10 shadow-xl">
                    <form onSubmit={submitVote}>
                        <div className="mb-5">
                            <label className="block text-[10px] text-[#94A3B8] font-bold tracking-wider mb-2 uppercase">Pays de résidence</label>
                            <div className="relative">
                                <select value={voteForm.country} onChange={handleCountryChange} className="w-full bg-[#1A2332] border border-white/5 rounded-xl px-4 py-3.5 text-sm font-semibold text-white appearance-none focus:outline-none focus:border-[#3B82F6]/50">
                                    <option data-code="CM" value="Cameroun">🇨🇲 Cameroun</option>
                                    <option data-code="GA" value="Gabon">🇬🇦 Gabon</option>
                                    <option data-code="CD" value="RDC">🇨🇩 République Dém. du Congo</option>
                                    <option data-code="CG" value="Congo">🇨🇬 Congo Brazzaville</option>
                                    <option data-code="TD" value="Tchad">🇹🇩 Tchad</option>
                                    <option data-code="CF" value="RCA">🇨🇫 RCA</option>
                                    <option data-code="FR" value="France">🇫🇷 France</option>
                                    <option data-code="US" value="États-Unis">🇺🇸 États-Unis</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#94A3B8]">
                                    <i className="fas fa-chevron-down text-xs"></i>
                                </div>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-[10px] text-[#94A3B8] font-bold tracking-wider mb-2 uppercase">Modèle souhaité</label>
                            <div className="relative">
                                <select value={voteForm.model} onChange={(e) => setVoteForm({...voteForm, model: e.target.value})} className="w-full bg-[#1A2332] border border-white/5 rounded-xl px-4 py-3.5 text-sm font-semibold text-white appearance-none focus:outline-none focus:border-[#3B82F6]/50">
                                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                                    <option value="GPT-4o">GPT-4o</option>
                                    <option value="Claude 3 Opus">Claude 3 Opus</option>
                                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#94A3B8]">
                                    <i className="fas fa-chevron-down text-xs"></i>
                                </div>
                            </div>
                        </div>

                        <div className="mb-5">
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-[10px] text-[#94A3B8] font-bold tracking-wider uppercase">Intensité d'utilisation prévue</label>
                                <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">{voteForm.intensity}/10</span>
                            </div>
                            <div className="relative w-full h-2 bg-[#1A2332] rounded-full">
                                <div className="absolute top-0 left-0 h-full bg-[#10B981] rounded-full" style={{width: `${voteForm.intensity * 10}%`}}></div>
                                <input type="range" value={voteForm.intensity} onChange={(e) => setVoteForm({...voteForm, intensity: parseInt(e.target.value)})} min="1" max="10" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <div className="absolute top-1/2 -mt-2.5 w-5 h-5 bg-white border-2 border-[#10B981] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] pointer-events-none" style={{left: `calc(${voteForm.intensity * 10}% - 10px)`}}></div>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-[10px] text-[#94A3B8] font-bold tracking-wider mb-2 uppercase">Cas d'usage (Optionnel)</label>
                            <textarea value={voteForm.useCase} onChange={(e) => setVoteForm({...voteForm, useCase: e.target.value})} className="w-full bg-[#1A2332] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#3B82F6]/50 resize-none h-24" placeholder="Ex: Développement d'applications mobiles, automatisation de mails..."></textarea>
                        </div>

                        <div className="mb-6">
                            <label className="block text-[10px] text-[#94A3B8] font-bold tracking-wider mb-2 uppercase">Me prévenir du lancement</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fas fa-at text-[#94A3B8]/70 text-sm"></i>
                                </div>
                                <input type="text" value={voteForm.contact} onChange={(e) => setVoteForm({...voteForm, contact: e.target.value})} className="w-full bg-[#1A2332] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#3B82F6]/50" placeholder="Email ou n° WhatsApp" />
                            </div>
                        </div>

                        {!user ? (
                            <button type="button" onClick={() => {setShowLoginModal(true); setIsSignUp(false);}} className="w-full font-bold py-4 rounded-xl text-sm transition-colors flex items-center justify-center space-x-2 bg-[#3B82F6] hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                                <i className="fas fa-sign-in-alt"></i>
                                <span>Connectez-vous pour voter</span>
                            </button>
                        ) : (
                            <button type="submit" disabled={isSubmitting || voteSuccess} className={`w-full font-bold py-4 rounded-xl text-sm transition-colors flex items-center justify-center space-x-2 ${voteSuccess ? 'bg-[#10B981] text-white' : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'}`}>
                                {!isSubmitting && !voteSuccess && (
                                    <div className="flex items-center space-x-2">
                                        <span>Soumettre mon vote</span>
                                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                            <i className="fas fa-check text-[#3B82F6] text-[10px]"></i>
                                        </div>
                                    </div>
                                )}
                                {isSubmitting && (
                                    <span>Envoi en cours... <i className="fas fa-spinner fa-spin ml-2"></i></span>
                                )}
                                {voteSuccess && (
                                    <span>Vote enregistré ! <i className="fas fa-check ml-2"></i></span>
                                )}
                            </button>
                        )}
                    </form>
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white leading-tight">Comparatif des prix<br/>API</h2>
                    <div className="bg-[#10B981] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase leading-tight text-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                        Jusqu'à<br/>-80%
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="bg-gradient-to-r from-[#122426] to-[#0D181C] border border-[#10B981]/10 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-[#0F2823] flex items-center justify-center">
                                <i className="fas fa-asterisk text-[#10B981] text-xl"></i>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 mb-0.5">
                                    <h3 className="font-bold text-white text-sm">GPT-4o</h3>
                                    <span className="bg-white text-black text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Fast</span>
                                </div>
                                <p className="text-[10px] text-[#94A3B8]">Pour 1M tokens (moyenne)</p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <p className="text-[10px] text-[#94A3B8] line-through mb-0.5">Prix officiel = $15.00</p>
                            <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-lg text-[#60A5FA]">$3.00</span>
                                <i className="fas fa-arrow-down text-[#10B981] text-[10px]"></i>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#19211D] to-[#0D181C] border border-[#10B981]/10 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-[#D97757] flex items-center justify-center">
                                <span className="text-lg font-black text-white" style={{fontFamily: 'serif'}}>A|</span>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 mb-0.5">
                                    <h3 className="font-bold text-white text-sm leading-tight">Claude 3.5<br/>Sonnet</h3>
                                    <span className="bg-[#F97316] text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">New</span>
                                </div>
                                <p className="text-[10px] text-[#94A3B8]">Pour 1M tokens (moyenne)</p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <p className="text-[10px] text-[#94A3B8] line-through mb-0.5">Prix officiel = $9.00</p>
                            <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-lg text-[#60A5FA]">$1.80</span>
                                <i className="fas fa-arrow-down text-[#10B981] text-[10px]"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0A262E] border border-[#144A55] rounded-xl p-4 text-center">
                    <p className="text-[11px] text-[#A5F3FC] leading-relaxed">
                        La facturation sera de tel sorte que pour <span className="font-bold text-white">1 500 XAF</span> on bénéficie de <span className="font-bold text-white">10$</span> d'API pour n'importe quel modèle et pour <span className="font-bold text-white">14 000 XAF</span> on bénéficie de <span className="font-bold text-white">100$</span>.
                    </p>
                </div>

            </div>
        </div>
      )}

      {/* Admin View */}
      {currentTab === 'admin' && (
        <div className="w-full min-h-screen bg-[#0B121A] text-white font-admin">

            {!isAdminAuthenticated ? (
                <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                        <i className="fas fa-lock text-[#EF4444] text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 tracking-widest uppercase text-center">Accès Restreint</h2>
                    <p className="text-[#94A3B8] text-sm text-center mb-8 max-w-[260px] leading-relaxed">
                        Veuillez vous authentifier pour accéder au tableau de bord des données réelles.
                    </p>

                    <form onSubmit={handleAdminLogin} className="w-full max-w-sm space-y-4">
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fas fa-user text-[#94A3B8]/70 text-sm"></i>
                                </div>
                                <input
                                    type="text"
                                    value={adminUsername}
                                    onChange={(e) => setAdminUsername(e.target.value)}
                                    className="w-full bg-[#1A2332] border border-white/5 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#EF4444]/50"
                                    placeholder="Nom d'utilisateur"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fas fa-key text-[#94A3B8]/70 text-sm"></i>
                                </div>
                                <input
                                    type="password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    className="w-full bg-[#1A2332] border border-white/5 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#EF4444]/50"
                                    placeholder="Mot de passe"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isAdminAuthenticating}
                            className="w-full bg-[#EF4444] hover:bg-red-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-[0_0_20px_rgba(239,68,68,0.3)] mt-2 flex items-center justify-center space-x-2"
                        >
                            {isAdminAuthenticating ? (
                                <span>Authentification... <i className="fas fa-spinner fa-spin ml-2"></i></span>
                            ) : (
                                <span>Connexion Admin</span>
                            )}
                        </button>
                    </form>
                </div>
            ) : (
            <>
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 bg-[#0B121A]/90 sticky top-0 z-20 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-[#EF4444]/20 flex items-center justify-center border border-[#EF4444]/30">
                        <i className="fas fa-shield-alt text-[#EF4444] text-sm"></i>
                    </div>
                    <span className="font-bold tracking-widest text-sm">ADMIN CONSOLE</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-[#047857]/20 border border-[#10B981]/20 text-[#10B981] text-[9px] font-bold px-2 py-1 rounded flex items-center tracking-widest uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5 animate-pulse shadow-[0_0_5px_#10B981]"></div>
                        SYS_ONLINE
                    </div>
                    <button onClick={logout} className="text-[#EF4444] hover:text-white transition-colors">
                        <i className="fas fa-sign-out-alt text-sm"></i>
                    </button>
                </div>
            </div>

            <div className="px-5 pt-5 pb-24 space-y-4">

                <div className="bg-[#111823] border border-white/5 rounded-xl p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
                    <div className="absolute inset-0 grid-bg-admin opacity-20 pointer-events-none"></div>
                    <div className="flex items-center space-x-1.5 mb-2 text-[#94A3B8] relative z-10">
                        <i className="fas fa-chart-bar text-[10px]"></i>
                        <span className="text-[10px] font-bold tracking-widest uppercase">TOTAL VOTES</span>
                    </div>
                    <h2 className="text-4xl font-bold text-[#10B981] mb-2 tracking-tighter relative z-10 shadow-success drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">{adminStats.totalVotes.toLocaleString()}</h2>
                    <div className="flex items-center space-x-1.5 text-[#10B981] text-[10px] relative z-10">
                        <i className="fas fa-arrow-trend-up"></i>
                        <span>En direct</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#111823] border border-white/5 rounded-xl p-4">
                        <div className="flex items-center space-x-1.5 mb-2 text-[#94A3B8]">
                            <i className="fas fa-crosshairs text-[10px]"></i>
                            <span className="text-[9px] font-bold tracking-widest uppercase">TAUX CONV.</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{(adminStats.totalVotes > 0 ? (adminStats.totalVotes / (adminStats.totalVotes + 150) * 100).toFixed(1) : "0.0")}%</h3>
                        <p className="text-[9px] text-[#94A3B8]">Basé sur les interactions</p>
                    </div>
                    <div className="bg-[#111823] border border-white/5 rounded-xl p-4">
                        <div className="flex items-center space-x-1.5 mb-2 text-[#94A3B8]">
                            <i className="fas fa-users text-[10px]"></i>
                            <span className="text-[9px] font-bold tracking-widest uppercase">USAGERS 24H</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[#3B82F6] mb-1 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">{adminStats.activeUsers.toLocaleString()}</h3>
                        <p className="text-[9px] text-[#94A3B8]">Actifs aujourd'hui</p>
                    </div>
                </div>

                <div className="bg-[#111823] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center space-x-2 mb-6 text-white">
                        <i className="fas fa-chart-line text-[#3B82F6] text-xs"></i>
                        <span className="text-xs font-bold tracking-widest uppercase">ANALYSE DES VOTES</span>
                    </div>

                    <div className="relative h-24 mb-6 border-b border-l border-white/10 pb-1 pl-1 text-[8px] text-[#94A3B8]">
                        <div className="absolute top-0 left-[-15px] transform -translate-y-1/2">5k</div>
                        <div className="absolute top-1/2 left-[-20px] transform -translate-y-1/2">2.5k</div>
                        <div className="absolute bottom-[-15px] left-0">0</div>
                        <div className="absolute bottom-[-15px] right-0">Auj</div>

                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 100">
                            <path d={adminStats.chartData.realLine} fill="none" stroke="#10B981" strokeWidth="2" vectorEffect="non-scaling-stroke" opacity="0.8" style={{ transition: 'd 0.5s ease' }} />
                        </svg>
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 100">
                            <path d={adminStats.chartData.genLine} fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4,4" vectorEffect="non-scaling-stroke" opacity="0.8" style={{ transition: 'd 0.5s ease' }} />
                        </svg>
                    </div>

                    <div className="flex items-center justify-center space-x-6 text-[10px]">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                            <span>Réels ({adminStats.reelsPercentage}%)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
                            <span>Générés ({adminStats.generatedPercentage}%)</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#111823] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center space-x-2 mb-6 text-white">
                        <i className="fas fa-globe-americas text-[#10B981] text-xs"></i>
                        <span className="text-xs font-bold tracking-widest uppercase">RÉPARTITION PAR PAYS</span>
                    </div>

                    <div className="space-y-4">
                        {adminStats.countries.length > 0 ? adminStats.countries.map((country) => (
                            <div key={country.name}>
                                <div className="flex items-center justify-between mb-1.5 text-[10px]">
                                    <div className="flex items-center space-x-2">
                                        <span>{country.flag}</span>
                                        <span>{country.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5 text-[#94A3B8]">
                                        <i className="fas fa-crosshairs"></i>
                                        <span>{country.count} votes</span>
                                    </div>
                                </div>
                                <div className="w-full bg-[#1A2332] h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[#10B981] h-full rounded-full transition-all duration-1000" style={{width: `${country.percent}%`}}></div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-[#94A3B8] text-sm py-4">Aucune donnée par pays disponible</div>
                        )}
                    </div>
                </div>

                <div className="bg-[#111823] border border-white/5 rounded-xl p-5 mb-6">
                    <div className="flex items-center justify-between mb-4 text-white">
                        <div className="flex items-center space-x-2">
                            <i className="fas fa-address-book text-[#3B82F6] text-xs"></i>
                            <span className="text-xs font-bold tracking-widest uppercase">BASE DE CONTACTS</span>
                        </div>
                        <button
                            onClick={exportContactsCSV}
                            className="bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 text-[#3B82F6] text-[10px] font-bold px-3 py-1.5 rounded flex items-center transition-colors border border-[#3B82F6]/30"
                        >
                            <i className="fas fa-download mr-1.5"></i>
                            EXPORTER CSV
                        </button>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 admin-scrollbar">
                        {adminStats.contacts.length > 0 ? adminStats.contacts.filter(c => c.contact).map((contact, index) => (
                            <div key={contact.id || index} className="bg-[#1A2332] rounded-lg p-3 text-[11px] flex justify-between items-center border border-white/5">
                                <div>
                                    <div className="font-bold text-white mb-0.5">{contact.contact}</div>
                                    <div className="text-[#94A3B8] flex items-center space-x-2">
                                        <span>{contact.country}</span>
                                        <span className="w-1 h-1 rounded-full bg-[#3B82F6]/50"></span>
                                        <span className="text-[#10B981] truncate max-w-[100px] inline-block">{contact.model}</span>
                                    </div>
                                </div>
                                <div className="text-[#64748B] text-[9px] whitespace-nowrap">{contact.date}</div>
                            </div>
                        )) : (
                            <div className="text-center text-[#94A3B8] text-sm py-4">Aucun contact enregistré (WhatsApp/Email)</div>
                        )}
                        {adminStats.contacts.length > 0 && adminStats.contacts.filter(c => c.contact).length === 0 && (
                            <div className="text-center text-[#94A3B8] text-sm py-4">Les votants actuels n'ont pas laissé de contact</div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex items-center space-x-2 mb-4 text-white px-1">
                        <i className="fas fa-list text-xs text-[#94A3B8]"></i>
                        <span className="text-xs font-bold tracking-widest uppercase">DERNIERS VOTES (LIVE)</span>
                    </div>

                    <div className="space-y-3">
                        {adminStats.latestVotes.length > 0 ? adminStats.latestVotes.map((vote, index) => (
                            <div key={index} className={`bg-[#111823] border border-white/5 rounded-xl p-4 border-l-2 relative transition-all duration-500 ${vote.real ? 'border-l-[#10B981]' : 'border-l-[#3B82F6]'}`}>

                                {!vote.real && (
                                    <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-[#3B82F6]"></div>
                                )}

                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-[10px]">{vote.flag}</span>
                                        <span className="text-[11px] font-bold">{vote.user}</span>

                                        {vote.real ? (
                                            <span className="bg-[#047857]/20 text-[#10B981] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">RÉEL</span>
                                        ) : (
                                            <span className="bg-[#3B82F6]/20 text-[#3B82F6] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">GÉNÉRÉ</span>
                                        )}
                                    </div>
                                    <span className="text-[#94A3B8] text-[9px]">{vote.time}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-[10px] text-[#94A3B8] mb-3">
                                    <span>› Vote pour:</span>
                                    <span className="text-white font-bold flex items-center space-x-1.5">{vote.model}</span>
                                </div>
                                <div className="w-full bg-[#1A2332] h-1 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${vote.real ? 'bg-[#10B981]' : 'bg-[#3B82F6]'}`} style={{width: '100%'}}></div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-[#94A3B8] text-sm py-4">Aucun vote pour l'instant</div>
                        )}
                    </div>
                </div>

            </div>
            </>
            )}
        </div>
      )}

    </div>
  )
}
