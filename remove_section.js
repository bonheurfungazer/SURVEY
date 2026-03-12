const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const searchSection = `<div className="mb-4 flex items-center justify-between">
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
                            <div className="flex items-center space-x-2">
                                <span className="text-[#94A3B8] line-through text-xs font-semibold">$30</span>
                                <span className="text-xl font-black text-[#10B981]">$6</span>
                            </div>
                            <span className="text-[9px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20 mt-1">-80% avec l'API Unifiée</span>
                        </div>
                    </div>

                    <div className="bg-[#111823] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-[#1A2332] flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 mb-0.5">
                                    <h3 className="font-bold text-white text-sm leading-tight">Claude Opus<br/>4.6</h3>
                                </div>
                                <p className="text-[10px] text-[#94A3B8]">Pour 1M tokens (moyenne)</p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <div className="flex items-center space-x-2">
                                <span className="text-[#94A3B8] line-through text-xs font-semibold">$35</span>
                                <span className="text-xl font-black text-[#3B82F6]">$7</span>
                            </div>
                            <span className="text-[9px] text-[#3B82F6] font-bold bg-[#3B82F6]/10 px-1.5 py-0.5 rounded border border-[#3B82F6]/20 mt-1">-80% avec l'API Unifiée</span>
                        </div>
                    </div>
                </div>`;

code = code.replace(searchSection, "");
fs.writeFileSync('src/app/page.tsx', code);
