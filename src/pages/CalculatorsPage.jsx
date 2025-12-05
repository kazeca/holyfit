import React, { useState } from 'react';
import { ArrowLeft, Calculator, Activity, Scale, Percent, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CalculatorsPage = () => {
    const navigate = useNavigate();
    const [activeCalc, setActiveCalc] = useState('bmi');

    const [bmiHeight, setBmiHeight] = useState('');
    const [bmiWeight, setBmiWeight] = useState('');
    const [bmiResult, setBmiResult] = useState(null);

    const calculateBMI = () => {
        const heightM = parseFloat(bmiHeight) / 100;
        const weightKg = parseFloat(bmiWeight);
        if (heightM && weightKg) {
            const bmi = (weightKg / (heightM * heightM)).toFixed(1);
            let category = '';
            if (bmi < 18.5) category = 'Abaixo do peso';
            else if (bmi < 25) category = 'Peso normal';
            else if (bmi < 30) category = 'Sobrepeso';
            else category = 'Obesidade';
            const result = { bmi, category };
            setBmiResult(result);
            // Save to localStorage
            localStorage.setItem('lastBMI', JSON.stringify({ height: bmiHeight, weight: bmiWeight, result, date: new Date().toISOString() }));
        }
    };

    // Load saved values on mount
    React.useEffect(() => {
        const savedBMI = localStorage.getItem('lastBMI');
        if (savedBMI) {
            const { height, weight, result } = JSON.parse(savedBMI);
            setBmiHeight(height);
            setBmiWeight(weight);
            setBmiResult(result);
        }
    }, []);

    const [macrosWeight, setMacrosWeight] = useState('');
    const [macrosGoal, setMacrosGoal] = useState('maintain');
    const [macrosResult, setMacrosResult] = useState(null);

    const calculateMacros = () => {
        const weight = parseFloat(macrosWeight);
        if (weight) {
            let protein, carbs, fat, calories;
            if (macrosGoal === 'cut') {
                protein = (weight * 2.2).toFixed(0);
                carbs = (weight * 2).toFixed(0);
                fat = (weight * 0.8).toFixed(0);
                calories = (protein * 4 + carbs * 4 + fat * 9).toFixed(0);
            } else if (macrosGoal === 'bulk') {
                protein = (weight * 2).toFixed(0);
                carbs = (weight * 4).toFixed(0);
                fat = (weight * 1).toFixed(0);
                calories = (protein * 4 + carbs * 4 + fat * 9).toFixed(0);
            } else {
                protein = (weight * 2).toFixed(0);
                carbs = (weight * 3).toFixed(0);
                fat = (weight * 0.9).toFixed(0);
                calories = (protein * 4 + carbs * 4 + fat * 9).toFixed(0);
            }
            setMacrosResult({ protein, carbs, fat, calories });
        }
    };

    const [tdeeWeight, setTdeeWeight] = useState('');
    const [tdeeHeight, setTdeeHeight] = useState('');
    const [tdeeAge, setTdeeAge] = useState('');
    const [tdeeGender, setTdeeGender] = useState('male');
    const [tdeeActivity, setTdeeActivity] = useState('moderate');
    const [tdeeResult, setTdeeResult] = useState(null);

    const calculateTDEE = () => {
        const weight = parseFloat(tdeeWeight);
        const height = parseFloat(tdeeHeight);
        const age = parseFloat(tdeeAge);
        if (weight && height && age) {
            let bmr;
            if (tdeeGender === 'male') {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            } else {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            }
            const activityMultipliers = {
                sedentary: 1.2,
                light: 1.375,
                moderate: 1.55,
                active: 1.725,
                veryActive: 1.9
            };
            const tdee = (bmr * activityMultipliers[tdeeActivity]).toFixed(0);
            setTdeeResult({ bmr: bmr.toFixed(0), tdee });
        }
    };

    const [bfGender, setBfGender] = useState('male');
    const [bfHeight, setBfHeight] = useState('');
    const [bfWaist, setBfWaist] = useState('');
    const [bfNeck, setBfNeck] = useState('');
    const [bfHip, setBfHip] = useState('');
    const [bfResult, setBfResult] = useState(null);

    const calculateBodyFat = () => {
        const height = parseFloat(bfHeight);
        const waist = parseFloat(bfWaist);
        const neck = parseFloat(bfNeck);
        const hip = parseFloat(bfHip);

        if (height && waist && neck) {
            let bodyFat;
            if (bfGender === 'male') {
                bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
            } else {
                if (hip) {
                    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
                }
            }
            if (bodyFat) {
                setBfResult({ bodyFat: bodyFat.toFixed(1) });
            }
        }
    };

    const [ormWeight, setOrmWeight] = useState('');
    const [ormReps, setOrmReps] = useState('');
    const [ormResult, setOrmResult] = useState(null);

    const calculateOneRepMax = () => {
        const weight = parseFloat(ormWeight);
        const reps = parseFloat(ormReps);
        if (weight && reps && reps >= 1 && reps <= 12) {
            const oneRM = (weight * (1 + reps / 30)).toFixed(1);
            setOrmResult({ oneRM });
        }
    };

    const calculators = [
        { id: 'bmi', name: 'IMC', icon: Scale, color: 'blue' },
        { id: 'macros', name: 'Macros', icon: Activity, color: 'green' },
        { id: 'tdee', name: 'TDEE', icon: Percent, color: 'orange' },
        { id: 'bodyfat', name: '% Gordura', icon: Dumbbell, color: 'purple' },
        { id: 'orm', name: '1RM', icon: Calculator, color: 'pink' }
    ];

    return (
        <div className="min-h-screen pb-32 pt-8 px-6 bg-gray-950 font-sans">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-3xl font-black text-white">Calculadoras</h1>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {calculators.map(calc => {
                    const Icon = calc.icon;
                    const isActive = activeCalc === calc.id;
                    return (
                        <button
                            key={calc.id}
                            onClick={() => setActiveCalc(calc.id)}
                            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${isActive
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            <Icon size={16} className="inline mr-2" />
                            {calc.name}
                        </button>
                    );
                })}
            </div>

            {activeCalc === 'bmi' && (
                <div className="bg-slate-800 border border-slate-700/50 rounded-3xl p-6">
                    <h2 className="text-xl font-black text-white mb-4">Calculadora de IMC</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Altura (cm)</label>
                            <input
                                type="number"
                                value={bmiHeight}
                                onChange={(e) => setBmiHeight(e.target.value)}
                                className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="170"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Peso (kg)</label>
                            <input
                                type="number"
                                value={bmiWeight}
                                onChange={(e) => setBmiWeight(e.target.value)}
                                className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="70"
                            />
                        </div>
                        <button
                            onClick={calculateBMI}
                            className="w-full py-4 rounded-xl font-bold text-white bg-blue-500 shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors"
                        >
                            Calcular IMC
                        </button>
                        {bmiResult && (
                            <div className="bg-slate-900 rounded-xl p-4 border border-blue-500/30">
                                <p className="text-slate-400 text-sm mb-2">Seu IMC:</p>
                                <p className="text-4xl font-black text-white mb-2">{bmiResult.bmi}</p>
                                <p className="text-blue-400 font-bold">{bmiResult.category}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeCalc === 'macros' && (
                <div className="bg-slate-800 border border-slate-700/50 rounded-3xl p-6">
                    <h2 className="text-xl font-black text-white mb-4">Calculadora de Macros</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Peso (kg)</label>
                            <input
                                type="number"
                                value={macrosWeight}
                                onChange={(e) => setMacrosWeight(e.target.value)}
                                className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="70"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Objetivo</label>
                            <select
                                value={macrosGoal}
                                onChange={(e) => setMacrosGoal(e.target.value)}
                                className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-green-500 outline-none"
                            >
                                <option value="cut">Definicao (Cut)</option>
                                <option value="maintain">Manutencao</option>
                                <option value="bulk">Ganho de Massa (Bulk)</option>
                            </select>
                        </div>
                        <button
                            onClick={calculateMacros}
                            className="w-full py-4 rounded-xl font-bold text-white bg-green-500 shadow-lg shadow-green-500/30 hover:bg-green-600 transition-colors"
                        >
                            Calcular Macros
                        </button>
                        {macrosResult && (
                            <div className="bg-slate-900 rounded-xl p-4 border border-green-500/30 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Calorias</span>
                                    <span className="text-white font-bold">{macrosResult.calories} kcal</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Proteina</span>
                                    <span className="text-green-400 font-bold">{macrosResult.protein}g</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Carboidratos</span>
                                    <span className="text-green-400 font-bold">{macrosResult.carbs}g</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Gordura</span>
                                    <span className="text-green-400 font-bold">{macrosResult.fat}g</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeCalc === 'tdee' && (
                <div className="bg-slate-800 border border-slate-700/50 rounded-3xl p-6">
                    <h2 className="text-xl font-black text-white mb-4">Calculadora TDEE</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Peso (kg)</label>
                                <input
                                    type="number"
                                    value={tdeeWeight}
                                    onChange={(e) => setTdeeWeight(e.target.value)}
                                    className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Altura (cm)</label>
                                <input
                                    type="number"
                                    value={tdeeHeight}
                                    onChange={(e) => setTdeeHeight(e.target.value)}
                                    className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Idade</label>
                                <input
                                    type="number"
                                    value={tdeeAge}
                                    onChange={(e) => setTdeeAge(e.target.value)}
                                    className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Sexo</label>
                                <select
                                    value={tdeeGender}
                                    onChange={(e) => setTdeeGender(e.target.value)}
                                    className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                                >
                                    <option value="male">Masculino</option>
                                    <option value="female">Feminino</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Nivel de Atividade</label>
                            <select
                                value={tdeeActivity}
                                onChange={(e) => setTdeeActivity(e.target.value)}
                                className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                            >
                                <option value="sedentary">Sedentario</option>
                                <option value="light">Levemente Ativo</option>
                                <option value="moderate">Moderadamente Ativo</option>
                                <option value="active">Muito Ativo</option>
                                <option value="veryActive">Extremamente Ativo</option>
                            </select>
                        </div>
                        <button
                            onClick={calculateTDEE}
                            className="w-full py-4 rounded-xl font-bold text-white bg-orange-500 shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-colors"
                        >
                            Calcular TDEE
                        </button>
                        {tdeeResult && (
                            <div className="bg-slate-900 rounded-xl p-4 border border-orange-500/30 space-y-3">
                                <div>
                                    <p className="text-slate-400 text-sm mb-2">Metabolismo Basal (BMR):</p>
                                    <p className="text-2xl font-black text-white">{tdeeResult.bmr} kcal/dia</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm mb-2">Gasto Calorico Total (TDEE):</p>
                                    <p className="text-3xl font-black text-orange-400">{tdeeResult.tdee} kcal/dia</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeCalc === 'bodyfat' && (
                <div className="bg-slate-800 border border-slate-700/50 rounded-3xl p-6">
                    <h2 className="text-xl font-black text-white mb-4">% Gordura Corporal</h2>
                    <p className="text-slate-400 text-sm mb-4">Metodo da Marinha dos EUA</p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Sexo</label>
                            <select
                                value={bfGender}
                                onChange={(e) => setBfGender(e.target.value)}
                                className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                                <option value="male">Masculino</option>
                                <option value="female">Feminino</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Altura (cm)</label>
                            <input
                                type="number"
                                value={bfHeight}
                                onChange={(e) => setBfHeight(e.target.value)}
                                className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Cintura (cm)</label>
                            <input
                                type="number"
                                value={bfWaist}
                                onChange={(e) => setBfWaist(e.target.value)}
                                className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Pescoco (cm)</label>
                            <input
                                type="number"
                                value={bfNeck}
                                onChange={(e) => setBfNeck(e.target.value)}
                                className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                        {bfGender === 'female' && (
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Quadril (cm)</label>
                                <input
                                    type="number"
                                    value={bfHip}
                                    onChange={(e) => setBfHip(e.target.value)}
                                    className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                        )}
                        <button
                            onClick={calculateBodyFat}
                            className="w-full py-4 rounded-xl font-bold text-white bg-purple-500 shadow-lg shadow-purple-500/30 hover:bg-purple-600 transition-colors"
                        >
                            Calcular
                        </button>
                        {bfResult && (
                            <div className="bg-slate-900 rounded-xl p-4 border border-purple-500/30">
                                <p className="text-slate-400 text-sm mb-2">% Gordura Corporal:</p>
                                <p className="text-4xl font-black text-purple-400">{bfResult.bodyFat}%</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeCalc === 'orm' && (
                <div className="bg-slate-800 border border-slate-700/50 rounded-3xl p-6">
                    <h2 className="text-xl font-black text-white mb-4">Calculadora 1RM</h2>
                    <p className="text-slate-400 text-sm mb-4">One Rep Max - Sua forca maxima estimada</p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Peso Levantado (kg)</label>
                            <input
                                type="number"
                                value={ormWeight}
                                onChange={(e) => setOrmWeight(e.target.value)}
                                className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-pink-500 outline-none"
                                placeholder="100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Repeticoes</label>
                            <input
                                type="number"
                                value={ormReps}
                                onChange={(e) => setOrmReps(e.target.value)}
                                className="w-full bg-slate-900 rounded-xl p-4 text-white focus:ring-2 focus:ring-pink-500 outline-none"
                                placeholder="5"
                            />
                        </div>
                        <button
                            onClick={calculateOneRepMax}
                            className="w-full py-4 rounded-xl font-bold text-white bg-pink-500 shadow-lg shadow-pink-500/30 hover:bg-pink-600 transition-colors"
                        >
                            Calcular 1RM
                        </button>
                        {ormResult && (
                            <div className="bg-slate-900 rounded-xl p-4 border border-pink-500/30">
                                <p className="text-slate-400 text-sm mb-2">Seu 1RM Estimado:</p>
                                <p className="text-4xl font-black text-pink-400">{ormResult.oneRM} kg</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalculatorsPage;
