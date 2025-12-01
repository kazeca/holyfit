import React from 'react';
import { Check, Clock, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Subscribe = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pb-32 pt-8 px-6 bg-gray-50">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-gray-900" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Purchase Pro</h1>
            </div>

            {/* Trial Banner */}
            <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm mb-10 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-500">
                    <Clock size={20} strokeWidth={2.5} />
                </div>
                <p className="text-gray-500 text-sm">
                    You have <span className="font-bold text-gray-900">5 days</span> left of 30 days trail
                </p>
            </div>

            {/* Premium Plan (Highlighted) */}
            <div className="relative mb-8 group cursor-pointer">
                <div className="absolute inset-0 bg-purple-600 blur-2xl opacity-30 group-hover:opacity-40 transition-opacity rounded-[2.5rem]"></div>
                <div className="relative bg-[#8B5CF6] rounded-[2.5rem] p-8 text-white shadow-xl transform scale-105 transition-transform border border-white/10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-5xl font-black tracking-tighter">$9.99 <span className="text-sm font-medium opacity-70 tracking-normal">/month</span></h2>
                            <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold mt-3 w-fit">
                                6 month subscriptions
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                            <Check size={18} strokeWidth={4} />
                        </div>
                    </div>

                    <div className="space-y-4 mt-8">
                        <div className="flex items-center gap-3 text-sm font-medium opacity-90">
                            <div className="w-1.5 h-1.5 rounded-full bg-white ring-4 ring-white/20"></div>
                            Unlimited exercise videos
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium opacity-90">
                            <div className="w-1.5 h-1.5 rounded-full bg-white ring-4 ring-white/20"></div>
                            Weekly diet meal plan
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium opacity-90">
                            <div className="w-1.5 h-1.5 rounded-full bg-white ring-4 ring-white/20"></div>
                            Advice from professional trainers
                        </div>
                    </div>
                </div>
            </div>

            {/* Basic Plan */}
            <div className="bg-white rounded-[2.5rem] p-8 text-gray-900 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100 cursor-pointer hover:border-orange-200 transition-colors group">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-5xl font-black tracking-tighter text-orange-400">$15.99 <span className="text-sm font-medium text-gray-400 tracking-normal">/month</span></h2>
                        <div className="bg-orange-50 px-4 py-1.5 rounded-full text-xs font-bold text-orange-500 mt-3 w-fit">
                            3 month subscriptions
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center group-hover:bg-orange-100 group-hover:text-orange-400 transition-colors">
                        <Check size={18} strokeWidth={4} />
                    </div>
                </div>

                <div className="space-y-4 mt-8">
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 ring-4 ring-orange-100"></div>
                        Unlimited exercise videos
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 ring-4 ring-orange-100"></div>
                        Weekly diet meal plan
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 ring-4 ring-orange-100"></div>
                        Advice from professional trainers
                    </div>
                </div>
            </div>

            {/* Purchase Button */}
            <button className="w-full bg-orange-500 text-white font-bold text-lg py-5 rounded-2xl mt-8 shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all">
                PURCHASE
            </button>
        </div>
    );
};

export default Subscribe;
