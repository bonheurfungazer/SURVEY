'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { verifyAdminCredentials, fetchSensitiveAdminData, checkAdminAuthStatus, logoutAdmin } from './actions'


const countryDialCodes: Record<string, string> = {
  "AF": "+93",
  "AL": "+355",
  "DZ": "+213",
  "AS": "+1-684",
  "AD": "+376",
  "AO": "+244",
  "AI": "+1-264",
  "AQ": "+672",
  "AG": "+1-268",
  "AR": "+54",
  "AM": "+374",
  "AW": "+297",
  "AU": "+61",
  "AT": "+43",
  "AZ": "+994",
  "BS": "+1-242",
  "BH": "+973",
  "BD": "+880",
  "BB": "+1-246",
  "BY": "+375",
  "BE": "+32",
  "BZ": "+501",
  "BJ": "+229",
  "BM": "+1-441",
  "BT": "+975",
  "BO": "+591",
  "BA": "+387",
  "BW": "+267",
  "BR": "+55",
  "IO": "+246",
  "VG": "+1-284",
  "BN": "+673",
  "BG": "+359",
  "BF": "+226",
  "BI": "+257",
  "KH": "+855",
  "CM": "+237",
  "CA": "+1",
  "CV": "+238",
  "KY": "+1-345",
  "CF": "+236",
  "TD": "+235",
  "CL": "+56",
  "CN": "+86",
  "CX": "+61",
  "CC": "+61",
  "CO": "+57",
  "KM": "+269",
  "CK": "+682",
  "CR": "+506",
  "HR": "+385",
  "CU": "+53",
  "CW": "+599",
  "CY": "+357",
  "CZ": "+420",
  "CD": "+243",
  "DK": "+45",
  "DJ": "+253",
  "DM": "+1-767",
  "DO": "+1-809",
  "TL": "+670",
  "EC": "+593",
  "EG": "+20",
  "SV": "+503",
  "GQ": "+240",
  "ER": "+291",
  "EE": "+372",
  "ET": "+251",
  "FK": "+500",
  "FO": "+298",
  "FJ": "+679",
  "FI": "+358",
  "FR": "+33",
  "PF": "+689",
  "GA": "+241",
  "GM": "+220",
  "GE": "+995",
  "DE": "+49",
  "GH": "+233",
  "GI": "+350",
  "GR": "+30",
  "GL": "+299",
  "GD": "+1-473",
  "GU": "+1-671",
  "GT": "+502",
  "GG": "+44-1481",
  "GN": "+224",
  "GW": "+245",
  "GY": "+592",
  "HT": "+509",
  "HN": "+504",
  "HK": "+852",
  "HU": "+36",
  "IS": "+354",
  "IN": "+91",
  "ID": "+62",
  "IR": "+98",
  "IQ": "+964",
  "IE": "+353",
  "IM": "+44-1624",
  "IL": "+972",
  "IT": "+39",
  "CI": "+225",
  "JM": "+1-876",
  "JP": "+81",
  "JE": "+44-1534",
  "JO": "+962",
  "KZ": "+7",
  "KE": "+254",
  "KI": "+686",
  "XK": "+383",
  "KW": "+965",
  "KG": "+996",
  "LA": "+856",
  "LV": "+371",
  "LB": "+961",
  "LS": "+266",
  "LR": "+231",
  "LY": "+218",
  "LI": "+423",
  "LT": "+370",
  "LU": "+352",
  "MO": "+853",
  "MK": "+389",
  "MG": "+261",
  "MW": "+265",
  "MY": "+60",
  "MV": "+960",
  "ML": "+223",
  "MT": "+356",
  "MH": "+692",
  "MR": "+222",
  "MU": "+230",
  "YT": "+262",
  "MX": "+52",
  "FM": "+691",
  "MD": "+373",
  "MC": "+377",
  "MN": "+976",
  "ME": "+382",
  "MS": "+1-664",
  "MA": "+212",
  "MZ": "+258",
  "MM": "+95",
  "NA": "+264",
  "NR": "+674",
  "NP": "+977",
  "NL": "+31",
  "AN": "+599",
  "NC": "+687",
  "NZ": "+64",
  "NI": "+505",
  "NE": "+227",
  "NG": "+234",
  "NU": "+683",
  "KP": "+850",
  "MP": "+1-670",
  "NO": "+47",
  "OM": "+968",
  "PK": "+92",
  "PW": "+680",
  "PS": "+970",
  "PA": "+507",
  "PG": "+675",
  "PY": "+595",
  "PE": "+51",
  "PH": "+63",
  "PN": "+870",
  "PL": "+48",
  "PT": "+351",
  "PR": "+1",
  "QA": "+974",
  "CG": "+242",
  "RE": "+262",
  "RO": "+40",
  "RU": "+7",
  "RW": "+250",
  "BL": "+590",
  "SH": "+290",
  "KN": "+1-869",
  "LC": "+1-758",
  "MF": "+590",
  "PM": "+508",
  "VC": "+1-784",
  "WS": "+685",
  "SM": "+378",
  "ST": "+239",
  "SA": "+966",
  "SN": "+221",
  "RS": "+381",
  "SC": "+248",
  "SL": "+232",
  "SG": "+65",
  "SX": "+1-721",
  "SK": "+421",
  "SI": "+386",
  "SB": "+677",
  "SO": "+252",
  "ZA": "+27",
  "KR": "+82",
  "SS": "+211",
  "ES": "+34",
  "LK": "+94",
  "SD": "+249",
  "SR": "+597",
  "SJ": "+47",
  "SZ": "+268",
  "SE": "+46",
  "CH": "+41",
  "SY": "+963",
  "TW": "+886",
  "TJ": "+992",
  "TZ": "+255",
  "TH": "+66",
  "TG": "+228",
  "TK": "+690",
  "TO": "+676",
  "TT": "+1-868",
  "TN": "+216",
  "TR": "+90",
  "TM": "+993",
  "TC": "+1-649",
  "TV": "+688",
  "VI": "+1-340",
  "UG": "+256",
  "UA": "+380",
  "AE": "+971",
  "GB": "+44",
  "US": "+1",
  "UY": "+598",
  "UZ": "+998",
  "VU": "+678",
  "VA": "+379",
  "VE": "+58",
  "VN": "+84",
  "WF": "+681",
  "EH": "+212",
  "YE": "+967",
  "ZM": "+260",
  "ZW": "+263"
};

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
  const [showVerificationPopup, setShowVerificationPopup] = useState(false)

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const [voteForm, setVoteForm] = useState({
    country: 'Cameroun',
    countryCode: 'CM',
    model: 'Claude Opus 4.6 (et antérieures)',
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
    contacts: [] as Array<{ id: string; contact: string; country: string; model: string; useCase: string; date: string }>,
    chartData: { realLine: "M0,90 Q40,90 80,90 T150,90 T250,90 T300,90", genLine: "M0,90 Q40,90 80,90 T150,90 T250,90 T300,90" }
  })

  const exportContactsCSV = () => {
    if (adminStats.contacts.length === 0) return;

    // Create CSV content
    const headers = ["Date", "Pays", "Modèle Choisi", "Cas d'usage", "Numéro WhatsApp"];
    const rows = adminStats.contacts.map(c => [
        `"${c.date}"`,
        `"${c.country}"`,
        `"${c.model}"`,
        `"${c.useCase || 'Non renseigné'}"`,
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
      // Auto-detect country
      try {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          if (data && data.country_name && data.country) {
              setVoteForm(prev => ({
                  ...prev,
                  country: data.country_name,
                  countryCode: data.country,
                  contact: countryDialCodes[data.country] || ''
              }));
          }
      } catch (e) {
          console.error("Failed to detect country", e);
      }

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

      // Check if URL has ?verified=true for successful confirmation
      if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          if (params.get('verified') === 'true') {
              showToast("Email confirmé avec succès ! Vous êtes connecté.", "success");
              // Remove query param to clean URL without refreshing page
              window.history.replaceState({}, document.title, window.location.pathname);
          }
      }

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
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
                email: loginEmail,
                password: loginPassword,
            })
            if (error) throw error

            // Si la vérification par email est activée sur Supabase, l'utilisateur est créé mais pas connecté
            if (data.user && data.user.identities && data.user.identities.length === 0) {
                showToast("Cet email est déjà utilisé. Veuillez vous connecter.", "error")
            } else if (data.session === null) {
                // showToast("Inscription réussie ! Veuillez vérifier votre boîte mail pour confirmer votre compte.")
                setShowVerificationPopup(true)
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
      const { count: totalVotes, error: globalErr } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('is_real_user', true)

      if (!globalErr) {
        setAdminStats(prev => ({
          ...prev,
          totalVotes: totalVotes || 0,
          reelsPercentage: 100, // Now 100% real
          generatedPercentage: 0
        }))
      }


      const { data: countryData, error: countryErr } = await supabase
        .from('votes')
        .select('country, country_code')
        .eq('is_real_user', true);

      if (!countryErr && countryData) {
        const counts: Record<string, {name: string, code: string, count: number}> = {};
        countryData.forEach((v: any) => {
           if (!counts[v.country_code]) {
               counts[v.country_code] = { name: v.country, code: v.country_code, count: 0 };
           }
           counts[v.country_code].count++;
        });

        const topCountries = Object.values(counts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 4)
            .map(c => ({
                name: c.name,
                count: c.count,
                percent: parseFloat(((c.count / (countryData.length || 1)) * 100).toFixed(1)),
                flag: getFlagEmoji(c.code)
            }));

        setAdminStats(prev => ({ ...prev, countries: topCountries }));
      }


      // Fetch all votes today to calculate chart
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      // Pour des raisons de sécurité, nous ne récupérons PAS les contact_info
      // sans être authentifié en tant qu'administrateur.
      // Le composant fetchera les contacts uniquement via la Server Action `fetchSensitiveAdminData`
      // une fois le login passé.

      // Get active users in last 24h
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const { count: activeUsers } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('is_real_user', true)
        .gte('created_at', yesterday.toISOString());

      if (activeUsers !== null) {
          setAdminStats(prev => ({ ...prev, activeUsers: activeUsers }));
      }

      const { data: recentData } = await supabase
        .from('votes')
        .select('id, country_code, model_choice, is_real_user, created_at, country')
        .eq('is_real_user', true)
        .order('created_at', { ascending: false })
        .limit(100)

      if (recentData && recentData.length > 0) {
        // We will fetch 24h data grouped by hour to match the server-side logic
        const { data: chartData } = await supabase
            .from('votes')
            .select('created_at')
            .eq('is_real_user', true)
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        let realLineStr = "M0,90 L300,90";
        if (chartData && chartData.length > 0) {
            const hourlyCounts = new Array(24).fill(0);
            chartData.forEach(vote => {
                const hour = new Date(vote.created_at).getHours();
                hourlyCounts[hour]++;
            });

            const maxVotesPerHour = Math.max(...hourlyCounts, 1);

            const realPoints = hourlyCounts.map((count, index) => {
                const x = (index / 23) * 300; // 24 points (0 to 23), mapped to 0-300 width
                const y = 90 - (count / maxVotesPerHour) * 80; // Map 0-max to 90-10 height
                return { x, y };
            });

            const generatePath = (points: {x: number, y: number}[]) => {
                if (points.length === 0) return "M0,90";
                if (points.length === 1) return `M${points[0].x},${points[0].y}`;
                if (points.length === 2) return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`;

                let path = `M${points[0].x},${points[0].y}`;
                for (let i = 0; i < points.length - 1; i++) {
                    const xc = (points[i].x + points[i + 1].x) / 2;
                    const yc = (points[i].y + points[i + 1].y) / 2;
                    // Use bezier curves for smoother graph
                    if (i === 0) {
                        path += ` Q${points[i].x},${points[i].y} ${xc},${yc}`;
                    } else {
                        path += ` T${xc},${yc}`;
                    }
                }
                path += ` T${points[points.length - 1].x},${points[points.length - 1].y}`;
                return path;
            };

            realLineStr = generatePath(realPoints);
        }

        const genLineStr = "M0,90 L300,90";

        setAdminStats(prev => ({
          ...prev,
          latestVotes: recentData.slice(0, 10).map(v => ({
            user: 'usr_' + v.id.substring(0, 5),
            flag: getFlagEmoji(v.country_code),
            model: v.model_choice,
            time: new Date(v.created_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}),
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
                  time: new Date(payload.new.created_at || new Date()).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}),
                  real: payload.new.is_real_user
              }
              const newLatest = [newVote, ...prev.latestVotes].slice(0, 10)

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
    const dialCode = countryDialCodes[code] || '';
    setVoteForm(prev => ({ ...prev, country: e.target.value, countryCode: code, contact: dialCode }))
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


      {showVerificationPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111823] border border-[#3B82F6]/30 rounded-2xl p-8 w-full max-w-sm relative shadow-[0_0_40px_rgba(59,130,246,0.2)] text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center mb-6 text-[#3B82F6] text-3xl shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse">
                    <i className="fas fa-envelope-open-text"></i>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Vérifiez votre boîte mail</h2>
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-8">
                    Un lien de confirmation a été envoyé à <span className="text-white font-semibold">{loginEmail}</span>. <br/>Veuillez cliquer sur ce lien pour activer votre compte.
                </p>
                <button
                    onClick={() => setShowVerificationPopup(false)}
                    className="w-full bg-[#1A2332] hover:bg-[#1E293B] border border-white/10 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
                >
                    J'ai compris
                </button>
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
                        <button onClick={() => {setShowLoginModal(true); setIsSignUp(true);}} className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-4 rounded-xl text-sm transition-all duration-200 active:scale-95 relative z-10 btn-primary-glow mb-8 flex items-center justify-center space-x-2">
                            <i className="fas fa-user-plus"></i>
                            <span>Créer un compte pour voter</span>
                        </button>
                    ) : (
                        <button onClick={() => setCurrentTab('vote')} className="w-full bg-[#10B981] hover:bg-[#047857] text-white font-bold py-4 rounded-xl text-sm transition-all duration-200 active:scale-95 relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.4)] mb-8 flex items-center justify-center space-x-2">
                            <span>Voter maintenant</span>
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    )}

                    <div className="flex items-center justify-center space-x-4 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-[#111823] border border-[#94A3B8]/30 flex items-center justify-center logo-glow-anthropic"><svg fill="#D97757" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8"><title>Anthropic</title><path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z"/></svg></div>
                        <div className="w-14 h-14 rounded-2xl bg-[#111823] border border-[#94A3B8]/30 flex items-center justify-center logo-glow-google"><svg fill="url(#gemini_paint)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8"><title>Google Gemini</title><path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/><defs><linearGradient id="gemini_paint" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#1B73E8"/><stop offset="0.5" stopColor="#D93025"/><stop offset="1" stopColor="#F29900"/></linearGradient></defs></svg></div>
                        <div className="w-14 h-14 rounded-2xl bg-[#111823] border border-[#94A3B8]/30 flex items-center justify-center logo-glow-openai"><svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8"><title>OpenAI</title><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg></div>
                    </div>
                </div>

                <div className="mt-8 text-center flex flex-col items-center">
                    <span className="text-[10px] text-[#94A3B8] uppercase tracking-[0.2em] font-bold mb-1">Votes Enregistrés</span>
                    <h2 className="text-5xl font-black tracking-tighter">{adminStats.totalVotes.toLocaleString("fr-FR")}</h2>
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
                    <p className="text-sm text-[#94A3B8] leading-relaxed max-w-[280px] mx-auto mb-4">
                        Participez au choix du prochain modèle à intégrer à notre API unifiée à -80%.
                    </p>
                    <div className="inline-flex items-center justify-center space-x-2 bg-[#1A2332] border border-[#3B82F6]/30 px-4 py-2 rounded-full text-xs font-semibold text-[#E2E8F0] shadow-sm">
                        <i className="fas fa-terminal text-[#3B82F6]"></i>
                        <span>Compatible avec Claude Code, Gemini CLI & Codex</span>
                    </div>
                </div>

                <div className="bg-[#111823] border border-white/5 rounded-[24px] p-5 mb-10 shadow-xl">
                    <form onSubmit={submitVote}>
                        <div className="mb-5">
                            <label className="block text-[10px] text-[#94A3B8] font-bold tracking-wider mb-2 uppercase">Pays de résidence</label>
                            <div className="relative">
                                <select value={voteForm.country} onChange={handleCountryChange} className="w-full bg-[#1A2332] border border-white/5 rounded-xl px-4 py-3.5 text-sm font-semibold text-white appearance-none focus:outline-none focus:border-[#3B82F6]/50">
                                    <option data-code="AF" value="Afghanistan">🇦🇫 Afghanistan</option>
<option data-code="ZA" value="Afrique du Sud">🇿🇦 Afrique du Sud</option>
<option data-code="AX" value="Ahvenanmaa">🇦🇽 Ahvenanmaa</option>
<option data-code="AL" value="Albanie">🇦🇱 Albanie</option>
<option data-code="DZ" value="Algérie">🇩🇿 Algérie</option>
<option data-code="DE" value="Allemagne">🇩🇪 Allemagne</option>
<option data-code="AD" value="Andorre">🇦🇩 Andorre</option>
<option data-code="AO" value="Angola">🇦🇴 Angola</option>
<option data-code="AI" value="Anguilla">🇦🇮 Anguilla</option>
<option data-code="AQ" value="Antarctique">🇦🇶 Antarctique</option>
<option data-code="AG" value="Antigua-et-Barbuda">🇦🇬 Antigua-et-Barbuda</option>
<option data-code="SA" value="Arabie Saoudite">🇸🇦 Arabie Saoudite</option>
<option data-code="AR" value="Argentine">🇦🇷 Argentine</option>
<option data-code="AM" value="Arménie">🇦🇲 Arménie</option>
<option data-code="AW" value="Aruba">🇦🇼 Aruba</option>
<option data-code="AU" value="Australie">🇦🇺 Australie</option>
<option data-code="AT" value="Autriche">🇦🇹 Autriche</option>
<option data-code="AZ" value="Azerbaïdjan">🇦🇿 Azerbaïdjan</option>
<option data-code="BS" value="Bahamas">🇧🇸 Bahamas</option>
<option data-code="BH" value="Bahreïn">🇧🇭 Bahreïn</option>
<option data-code="BD" value="Bangladesh">🇧🇩 Bangladesh</option>
<option data-code="BB" value="Barbade">🇧🇧 Barbade</option>
<option data-code="BE" value="Belgique">🇧🇪 Belgique</option>
<option data-code="BZ" value="Belize">🇧🇿 Belize</option>
<option data-code="BJ" value="Bénin">🇧🇯 Bénin</option>
<option data-code="BM" value="Bermudes">🇧🇲 Bermudes</option>
<option data-code="BT" value="Bhoutan">🇧🇹 Bhoutan</option>
<option data-code="BY" value="Biélorussie">🇧🇾 Biélorussie</option>
<option data-code="MM" value="Birmanie">🇲🇲 Birmanie</option>
<option data-code="BO" value="Bolivie">🇧🇴 Bolivie</option>
<option data-code="BA" value="Bosnie-Herzégovine">🇧🇦 Bosnie-Herzégovine</option>
<option data-code="BW" value="Botswana">🇧🇼 Botswana</option>
<option data-code="BR" value="Brésil">🇧🇷 Brésil</option>
<option data-code="BN" value="Brunei">🇧🇳 Brunei</option>
<option data-code="BG" value="Bulgarie">🇧🇬 Bulgarie</option>
<option data-code="BF" value="Burkina Faso">🇧🇫 Burkina Faso</option>
<option data-code="BI" value="Burundi">🇧🇮 Burundi</option>
<option data-code="KH" value="Cambodge">🇰🇭 Cambodge</option>
<option data-code="CM" value="Cameroun">🇨🇲 Cameroun</option>
<option data-code="CA" value="Canada">🇨🇦 Canada</option>
<option data-code="CL" value="Chili">🇨🇱 Chili</option>
<option data-code="CN" value="Chine">🇨🇳 Chine</option>
<option data-code="CY" value="Chypre">🇨🇾 Chypre</option>
<option data-code="VA" value="Cité du Vatican">🇻🇦 Cité du Vatican</option>
<option data-code="CO" value="Colombie">🇨🇴 Colombie</option>
<option data-code="KM" value="Comores">🇰🇲 Comores</option>
<option data-code="CG" value="Congo">🇨🇬 Congo</option>
<option data-code="CD" value="Congo (Rép. dém.)">🇨🇩 Congo (Rép. dém.)</option>
<option data-code="KP" value="Corée du Nord">🇰🇵 Corée du Nord</option>
<option data-code="KR" value="Corée du Sud">🇰🇷 Corée du Sud</option>
<option data-code="CR" value="Costa Rica">🇨🇷 Costa Rica</option>
<option data-code="CI" value="Côte d'Ivoire">🇨🇮 Côte d'Ivoire</option>
<option data-code="HR" value="Croatie">🇭🇷 Croatie</option>
<option data-code="CU" value="Cuba">🇨🇺 Cuba</option>
<option data-code="CW" value="Curaçao">🇨🇼 Curaçao</option>
<option data-code="DK" value="Danemark">🇩🇰 Danemark</option>
<option data-code="DJ" value="Djibouti">🇩🇯 Djibouti</option>
<option data-code="DM" value="Dominique">🇩🇲 Dominique</option>
<option data-code="EG" value="Égypte">🇪🇬 Égypte</option>
<option data-code="AE" value="Émirats arabes unis">🇦🇪 Émirats arabes unis</option>
<option data-code="EC" value="Équateur">🇪🇨 Équateur</option>
<option data-code="ER" value="Érythrée">🇪🇷 Érythrée</option>
<option data-code="ES" value="Espagne">🇪🇸 Espagne</option>
<option data-code="EE" value="Estonie">🇪🇪 Estonie</option>
<option data-code="US" value="États-Unis">🇺🇸 États-Unis</option>
<option data-code="ET" value="Éthiopie">🇪🇹 Éthiopie</option>
<option data-code="FJ" value="Fidji">🇫🇯 Fidji</option>
<option data-code="FI" value="Finlande">🇫🇮 Finlande</option>
<option data-code="FR" value="France">🇫🇷 France</option>
<option data-code="GA" value="Gabon">🇬🇦 Gabon</option>
<option data-code="GM" value="Gambie">🇬🇲 Gambie</option>
<option data-code="GE" value="Géorgie">🇬🇪 Géorgie</option>
<option data-code="GS" value="Géorgie du Sud-et-les Îles Sandwich du Sud">🇬🇸 Géorgie du Sud-et-les Îles Sandwich du Sud</option>
<option data-code="GH" value="Ghana">🇬🇭 Ghana</option>
<option data-code="GI" value="Gibraltar">🇬🇮 Gibraltar</option>
<option data-code="GR" value="Grèce">🇬🇷 Grèce</option>
<option data-code="GD" value="Grenade">🇬🇩 Grenade</option>
<option data-code="GL" value="Groenland">🇬🇱 Groenland</option>
<option data-code="GP" value="Guadeloupe">🇬🇵 Guadeloupe</option>
<option data-code="GU" value="Guam">🇬🇺 Guam</option>
<option data-code="GT" value="Guatemala">🇬🇹 Guatemala</option>
<option data-code="GG" value="Guernesey">🇬🇬 Guernesey</option>
<option data-code="GN" value="Guinée">🇬🇳 Guinée</option>
<option data-code="GQ" value="Guinée équatoriale">🇬🇶 Guinée équatoriale</option>
<option data-code="GW" value="Guinée-Bissau">🇬🇼 Guinée-Bissau</option>
<option data-code="GY" value="Guyana">🇬🇾 Guyana</option>
<option data-code="GF" value="Guyane">🇬🇫 Guyane</option>
<option data-code="HT" value="Haïti">🇭🇹 Haïti</option>
<option data-code="HN" value="Honduras">🇭🇳 Honduras</option>
<option data-code="HK" value="Hong Kong">🇭🇰 Hong Kong</option>
<option data-code="HU" value="Hongrie">🇭🇺 Hongrie</option>
<option data-code="BV" value="Île Bouvet">🇧🇻 Île Bouvet</option>
<option data-code="CX" value="Île Christmas">🇨🇽 Île Christmas</option>
<option data-code="IM" value="Île de Man">🇮🇲 Île de Man</option>
<option data-code="MU" value="Île Maurice">🇲🇺 Île Maurice</option>
<option data-code="NF" value="Île Norfolk">🇳🇫 Île Norfolk</option>
<option data-code="KY" value="Îles Caïmans">🇰🇾 Îles Caïmans</option>
<option data-code="CC" value="Îles Cocos">🇨🇨 Îles Cocos</option>
<option data-code="CK" value="Îles Cook">🇨🇰 Îles Cook</option>
<option data-code="CV" value="Îles du Cap-Vert">🇨🇻 Îles du Cap-Vert</option>
<option data-code="FO" value="Îles Féroé">🇫🇴 Îles Féroé</option>
<option data-code="HM" value="Îles Heard-et-MacDonald">🇭🇲 Îles Heard-et-MacDonald</option>
<option data-code="FK" value="Îles Malouines">🇫🇰 Îles Malouines</option>
<option data-code="MP" value="Îles Mariannes du Nord">🇲🇵 Îles Mariannes du Nord</option>
<option data-code="MH" value="Îles Marshall">🇲🇭 Îles Marshall</option>
<option data-code="UM" value="Îles mineures éloignées des États-Unis">🇺🇲 Îles mineures éloignées des États-Unis</option>
<option data-code="PN" value="Îles Pitcairn">🇵🇳 Îles Pitcairn</option>
<option data-code="SB" value="Îles Salomon">🇸🇧 Îles Salomon</option>
<option data-code="TC" value="Îles Turques-et-Caïques">🇹🇨 Îles Turques-et-Caïques</option>
<option data-code="VG" value="Îles Vierges britanniques">🇻🇬 Îles Vierges britanniques</option>
<option data-code="VI" value="Îles Vierges des États-Unis">🇻🇮 Îles Vierges des États-Unis</option>
<option data-code="IN" value="Inde">🇮🇳 Inde</option>
<option data-code="ID" value="Indonésie">🇮🇩 Indonésie</option>
<option data-code="IQ" value="Irak">🇮🇶 Irak</option>
<option data-code="IR" value="Iran">🇮🇷 Iran</option>
<option data-code="IE" value="Irlande">🇮🇪 Irlande</option>
<option data-code="IS" value="Islande">🇮🇸 Islande</option>
<option data-code="IL" value="Israël">🇮🇱 Israël</option>
<option data-code="IT" value="Italie">🇮🇹 Italie</option>
<option data-code="JM" value="Jamaïque">🇯🇲 Jamaïque</option>
<option data-code="JP" value="Japon">🇯🇵 Japon</option>
<option data-code="JE" value="Jersey">🇯🇪 Jersey</option>
<option data-code="JO" value="Jordanie">🇯🇴 Jordanie</option>
<option data-code="KZ" value="Kazakhstan">🇰🇿 Kazakhstan</option>
<option data-code="KE" value="Kenya">🇰🇪 Kenya</option>
<option data-code="KG" value="Kirghizistan">🇰🇬 Kirghizistan</option>
<option data-code="KI" value="Kiribati">🇰🇮 Kiribati</option>
<option data-code="XK" value="Kosovo">🇽🇰 Kosovo</option>
<option data-code="KW" value="Koweït">🇰🇼 Koweït</option>
<option data-code="LA" value="Laos">🇱🇦 Laos</option>
<option data-code="LS" value="Lesotho">🇱🇸 Lesotho</option>
<option data-code="LV" value="Lettonie">🇱🇻 Lettonie</option>
<option data-code="LB" value="Liban">🇱🇧 Liban</option>
<option data-code="LR" value="Liberia">🇱🇷 Liberia</option>
<option data-code="LY" value="Libye">🇱🇾 Libye</option>
<option data-code="LI" value="Liechtenstein">🇱🇮 Liechtenstein</option>
<option data-code="LT" value="Lituanie">🇱🇹 Lituanie</option>
<option data-code="LU" value="Luxembourg">🇱🇺 Luxembourg</option>
<option data-code="MO" value="Macao">🇲🇴 Macao</option>
<option data-code="MK" value="Macédoine du Nord">🇲🇰 Macédoine du Nord</option>
<option data-code="MG" value="Madagascar">🇲🇬 Madagascar</option>
<option data-code="MY" value="Malaisie">🇲🇾 Malaisie</option>
<option data-code="MW" value="Malawi">🇲🇼 Malawi</option>
<option data-code="MV" value="Maldives">🇲🇻 Maldives</option>
<option data-code="ML" value="Mali">🇲🇱 Mali</option>
<option data-code="MT" value="Malte">🇲🇹 Malte</option>
<option data-code="MA" value="Maroc">🇲🇦 Maroc</option>
<option data-code="MQ" value="Martinique">🇲🇶 Martinique</option>
<option data-code="MR" value="Mauritanie">🇲🇷 Mauritanie</option>
<option data-code="YT" value="Mayotte">🇾🇹 Mayotte</option>
<option data-code="MX" value="Mexique">🇲🇽 Mexique</option>
<option data-code="FM" value="Micronésie">🇫🇲 Micronésie</option>
<option data-code="MD" value="Moldavie">🇲🇩 Moldavie</option>
<option data-code="MC" value="Monaco">🇲🇨 Monaco</option>
<option data-code="MN" value="Mongolie">🇲🇳 Mongolie</option>
<option data-code="ME" value="Monténégro">🇲🇪 Monténégro</option>
<option data-code="MS" value="Montserrat">🇲🇸 Montserrat</option>
<option data-code="MZ" value="Mozambique">🇲🇿 Mozambique</option>
<option data-code="NA" value="Namibie">🇳🇦 Namibie</option>
<option data-code="NR" value="Nauru">🇳🇷 Nauru</option>
<option data-code="NP" value="Népal">🇳🇵 Népal</option>
<option data-code="NI" value="Nicaragua">🇳🇮 Nicaragua</option>
<option data-code="NE" value="Niger">🇳🇪 Niger</option>
<option data-code="NG" value="Nigéria">🇳🇬 Nigéria</option>
<option data-code="NU" value="Niue">🇳🇺 Niue</option>
<option data-code="NO" value="Norvège">🇳🇴 Norvège</option>
<option data-code="NC" value="Nouvelle-Calédonie">🇳🇨 Nouvelle-Calédonie</option>
<option data-code="NZ" value="Nouvelle-Zélande">🇳🇿 Nouvelle-Zélande</option>
<option data-code="OM" value="Oman">🇴🇲 Oman</option>
<option data-code="UG" value="Ouganda">🇺🇬 Ouganda</option>
<option data-code="UZ" value="Ouzbékistan">🇺🇿 Ouzbékistan</option>
<option data-code="PK" value="Pakistan">🇵🇰 Pakistan</option>
<option data-code="PW" value="Palaos (Palau)">🇵🇼 Palaos (Palau)</option>
<option data-code="PS" value="Palestine">🇵🇸 Palestine</option>
<option data-code="PA" value="Panama">🇵🇦 Panama</option>
<option data-code="PG" value="Papouasie-Nouvelle-Guinée">🇵🇬 Papouasie-Nouvelle-Guinée</option>
<option data-code="PY" value="Paraguay">🇵🇾 Paraguay</option>
<option data-code="NL" value="Pays-Bas">🇳🇱 Pays-Bas</option>
<option data-code="BQ" value="Pays-Bas caribéens">🇧🇶 Pays-Bas caribéens</option>
<option data-code="PE" value="Pérou">🇵🇪 Pérou</option>
<option data-code="PH" value="Philippines">🇵🇭 Philippines</option>
<option data-code="PL" value="Pologne">🇵🇱 Pologne</option>
<option data-code="PF" value="Polynésie française">🇵🇫 Polynésie française</option>
<option data-code="PR" value="Porto Rico">🇵🇷 Porto Rico</option>
<option data-code="PT" value="Portugal">🇵🇹 Portugal</option>
<option data-code="QA" value="Qatar">🇶🇦 Qatar</option>
<option data-code="CF" value="République centrafricaine">🇨🇫 République centrafricaine</option>
<option data-code="DO" value="République dominicaine">🇩🇴 République dominicaine</option>
<option data-code="RE" value="Réunion">🇷🇪 Réunion</option>
<option data-code="RO" value="Roumanie">🇷🇴 Roumanie</option>
<option data-code="GB" value="Royaume-Uni">🇬🇧 Royaume-Uni</option>
<option data-code="RU" value="Russie">🇷🇺 Russie</option>
<option data-code="RW" value="Rwanda">🇷🇼 Rwanda</option>
<option data-code="EH" value="Sahara Occidental">🇪🇭 Sahara Occidental</option>
<option data-code="BL" value="Saint-Barthélemy">🇧🇱 Saint-Barthélemy</option>
<option data-code="KN" value="Saint-Christophe-et-Niévès">🇰🇳 Saint-Christophe-et-Niévès</option>
<option data-code="SM" value="Saint-Marin">🇸🇲 Saint-Marin</option>
<option data-code="MF" value="Saint-Martin">🇲🇫 Saint-Martin</option>
<option data-code="SX" value="Saint-Martin">🇸🇽 Saint-Martin</option>
<option data-code="PM" value="Saint-Pierre-et-Miquelon">🇵🇲 Saint-Pierre-et-Miquelon</option>
<option data-code="VC" value="Saint-Vincent-et-les-Grenadines">🇻🇨 Saint-Vincent-et-les-Grenadines</option>
<option data-code="SH" value="Sainte-Hélène, Ascension et Tristan da Cunha">🇸🇭 Sainte-Hélène, Ascension et Tristan da Cunha</option>
<option data-code="LC" value="Sainte-Lucie">🇱🇨 Sainte-Lucie</option>
<option data-code="SV" value="Salvador">🇸🇻 Salvador</option>
<option data-code="WS" value="Samoa">🇼🇸 Samoa</option>
<option data-code="AS" value="Samoa américaines">🇦🇸 Samoa américaines</option>
<option data-code="ST" value="São Tomé et Príncipe">🇸🇹 São Tomé et Príncipe</option>
<option data-code="SN" value="Sénégal">🇸🇳 Sénégal</option>
<option data-code="RS" value="Serbie">🇷🇸 Serbie</option>
<option data-code="SC" value="Seychelles">🇸🇨 Seychelles</option>
<option data-code="SL" value="Sierra Leone">🇸🇱 Sierra Leone</option>
<option data-code="SG" value="Singapour">🇸🇬 Singapour</option>
<option data-code="SK" value="Slovaquie">🇸🇰 Slovaquie</option>
<option data-code="SI" value="Slovénie">🇸🇮 Slovénie</option>
<option data-code="SO" value="Somalie">🇸🇴 Somalie</option>
<option data-code="SD" value="Soudan">🇸🇩 Soudan</option>
<option data-code="SS" value="Soudan du Sud">🇸🇸 Soudan du Sud</option>
<option data-code="LK" value="Sri Lanka">🇱🇰 Sri Lanka</option>
<option data-code="SE" value="Suède">🇸🇪 Suède</option>
<option data-code="CH" value="Suisse">🇨🇭 Suisse</option>
<option data-code="SR" value="Surinam">🇸🇷 Surinam</option>
<option data-code="SJ" value="Svalbard et Jan Mayen">🇸🇯 Svalbard et Jan Mayen</option>
<option data-code="SZ" value="Swaziland">🇸🇿 Swaziland</option>
<option data-code="SY" value="Syrie">🇸🇾 Syrie</option>
<option data-code="TJ" value="Tadjikistan">🇹🇯 Tadjikistan</option>
<option data-code="TW" value="Taïwan">🇹🇼 Taïwan</option>
<option data-code="TZ" value="Tanzanie">🇹🇿 Tanzanie</option>
<option data-code="TD" value="Tchad">🇹🇩 Tchad</option>
<option data-code="CZ" value="Tchéquie">🇨🇿 Tchéquie</option>
<option data-code="TF" value="Terres australes et antarctiques françaises">🇹🇫 Terres australes et antarctiques françaises</option>
<option data-code="IO" value="Territoire britannique de l'océan Indien">🇮🇴 Territoire britannique de l'océan Indien</option>
<option data-code="TH" value="Thaïlande">🇹🇭 Thaïlande</option>
<option data-code="TL" value="Timor oriental">🇹🇱 Timor oriental</option>
<option data-code="TG" value="Togo">🇹🇬 Togo</option>
<option data-code="TK" value="Tokelau">🇹🇰 Tokelau</option>
<option data-code="TO" value="Tonga">🇹🇴 Tonga</option>
<option data-code="TT" value="Trinité-et-Tobago">🇹🇹 Trinité-et-Tobago</option>
<option data-code="TN" value="Tunisie">🇹🇳 Tunisie</option>
<option data-code="TM" value="Turkménistan">🇹🇲 Turkménistan</option>
<option data-code="TR" value="Turquie">🇹🇷 Turquie</option>
<option data-code="TV" value="Tuvalu">🇹🇻 Tuvalu</option>
<option data-code="UA" value="Ukraine">🇺🇦 Ukraine</option>
<option data-code="UY" value="Uruguay">🇺🇾 Uruguay</option>
<option data-code="VU" value="Vanuatu">🇻🇺 Vanuatu</option>
<option data-code="VE" value="Venezuela">🇻🇪 Venezuela</option>
<option data-code="VN" value="Viêt Nam">🇻🇳 Viêt Nam</option>
<option data-code="WF" value="Wallis-et-Futuna">🇼🇫 Wallis-et-Futuna</option>
<option data-code="YE" value="Yémen">🇾🇪 Yémen</option>
<option data-code="ZM" value="Zambie">🇿🇲 Zambie</option>
<option data-code="ZW" value="Zimbabwe">🇿🇼 Zimbabwe</option>
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
                                    <option value="Claude Opus 4.6 (et antérieures)">Claude Opus 4.6 (et versions 2026 en descendant)</option>
                                    <option value="GPT-5.4 Thinking (et antérieures)">GPT-5.4 Thinking (et versions 2026 en descendant)</option>
                                    <option value="Gemini 3.1 Pro (et antérieures)">Gemini 3.1 Pro (et versions 2026 en descendant)</option>
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
                            <label className="block text-[10px] text-[#94A3B8] font-bold tracking-wider mb-2 uppercase">Cas d'usage</label>
                            <textarea value={voteForm.useCase} onChange={(e) => setVoteForm({...voteForm, useCase: e.target.value})} className="w-full bg-[#1A2332] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#3B82F6]/50 resize-none h-24" placeholder="Ex: Développement d'applications mobiles, automatisation de mails..." required></textarea>
                        </div>

                        <div className="mb-6">
                            <label className="block text-[10px] text-[#94A3B8] font-bold tracking-wider mb-2 uppercase">Me prévenir du lancement</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fab fa-whatsapp text-[#10B981]/70 text-sm"></i>
                                </div>
                                <input type="text" value={voteForm.contact} onChange={(e) => setVoteForm({...voteForm, contact: e.target.value})} className="w-full bg-[#1A2332] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#3B82F6]/50" placeholder="n° WhatsApp (ex: +237...)" pattern="^\\+?[1-9]\\d{1,14}$" title="Veuillez entrer un numéro valide (ex: +33612345678)" required />
                            </div>
                        </div>

                        {!user ? (
                            <button type="button" onClick={() => {setShowLoginModal(true); setIsSignUp(false);}} className="w-full font-bold py-4 rounded-xl text-sm transition-all duration-200 active:scale-95 flex items-center justify-center space-x-2 bg-[#3B82F6] hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                                <i className="fas fa-sign-in-alt"></i>
                                <span>Connectez-vous pour voter</span>
                            </button>
                        ) : (
                            <button type="submit" disabled={isSubmitting || voteSuccess} className={`w-full font-bold py-4 rounded-xl text-sm transition-all duration-200 active:scale-95 flex items-center justify-center space-x-2 ${voteSuccess ? 'bg-[#10B981] text-white' : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'}`}>
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
                    <div className="bg-gradient-to-r from-[#122426] to-[#0D181C] border border-[#10B981]/10 p-4 rounded-xl flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-[#0F2823] flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .515 4.911 6.05 6.05 0 0 0 6.515 2.9 6.065 6.065 0 0 0 10.276-2.17 5.99 5.99 0 0 0 3.997-2.9 6.05 6.05 0 0 0-.748-7.097zM12.083 20.443c-1.928 0-3.722-.962-4.821-2.584l6.095-3.518V7.306l2.946 1.7-4.22 11.437zM4.615 15.65c-.964-1.666-1.12-3.712-.42-5.503L10.29 13.67v6.868l-2.946-1.7v-3.188zm1.88-9.452c.965-1.667 2.684-2.73 4.61-2.73v7.037L5.008 7.031l2.946-1.7 1.492 3.19zm11.009.61c.963 1.667 1.12 3.713.42 5.504l-6.096-3.522v-6.87l2.946 1.701v3.187zm-1.88 9.451c-.965 1.667-2.684 2.73-4.61 2.73V11.953l6.097 3.473-2.946 1.701-1.493-3.19zM11.917 3.557c1.928 0 3.722.962 4.821 2.585L10.643 9.66V16.69l-2.946-1.7V3.557zm1.616 9.389-3.056-1.763v-3.526l3.056-1.763 3.056 1.763v3.526l-3.056 1.763z"/></svg>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 mb-0.5">
                                    <h3 className="font-bold text-white text-sm leading-tight">GPT-5.4<br/>Thinking</h3>
                                    <span className="bg-[#10B981] text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">2026</span>
                                </div>
                                <p className="text-[10px] text-[#94A3B8]">Pour 1M tokens (moyenne)</p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <p className="text-[10px] text-[#94A3B8] line-through mb-0.5">Prix officiel = $20.00</p>
                            <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-lg text-[#60A5FA]">$4.00</span>
                                <i className="fas fa-arrow-down text-[#10B981] text-[10px]"></i>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#19211D] to-[#0D181C] border border-[#10B981]/10 p-4 rounded-xl flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-[#2D2A26] border border-[#D2996E]/30 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M14.5 5.5l-9 13H8.5l9-13h-3z" fill="#E2E0D4"/><path d="M5.5 18.5h3L11.5 13H8.5l-3 5.5z" fill="#E2E0D4"/><path d="M19.5 18.5h-3l-3-5.5h3l3 5.5z" fill="#D2996E"/></svg>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 mb-0.5">
                                    <h3 className="font-bold text-white text-sm leading-tight">Claude Opus<br/>4.6</h3>
                                    <span className="bg-[#D2996E] text-[#111823] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">2026</span>
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

                    <div className="bg-gradient-to-r from-[#121A26] to-[#0D181C] border border-[#3B82F6]/10 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-[#0F172A] border border-white/10 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M12.0003 2.05041C12.4419 6.20811 15.655 9.42125 19.8127 9.86282V14.1379C15.655 14.5794 12.4419 17.7926 12.0003 21.9503H7.99967C7.55809 17.7926 4.34496 14.5794 0.187256 14.1379V9.86282C4.34496 9.42125 7.55809 6.20811 7.99967 2.05041H12.0003Z" fill="url(#gemini_paint0_linear_sm)"/><defs><linearGradient id="gemini_paint0_linear_sm" x1="10" y1="2.05041" x2="10" y2="21.9503" gradientUnits="userSpaceOnUse"><stop stop-color="#1B73E8"/><stop offset="0.5" stop-color="#D93025"/><stop offset="1" stop-color="#F29900"/></linearGradient></defs></svg>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 mb-0.5">
                                    <h3 className="font-bold text-white text-sm leading-tight">Gemini 3.1<br/>Pro</h3>
                                    <span className="bg-[#3B82F6] text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">2026</span>
                                </div>
                                <p className="text-[10px] text-[#94A3B8]">Pour 1M tokens (moyenne)</p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <p className="text-[10px] text-[#94A3B8] line-through mb-0.5">Prix officiel = $10.00</p>
                            <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-lg text-[#60A5FA]">$2.00</span>
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
                        <div className="absolute top-0 left-[-20px] transform -translate-y-1/2 text-[8px] opacity-50">Max</div>
                        <div className="absolute top-1/2 left-[-20px] transform -translate-y-1/2 text-[8px] opacity-50">Moy</div>
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
