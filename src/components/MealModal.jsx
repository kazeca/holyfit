import React, { useState } from 'react';
import { X, Search, Camera, Plus, Minus, Apple } from 'lucide-react';
import { commonFoods, searchFoods } from '../data/commonFoods';
import PhotoProofModal from './PhotoProofModal';
import { useGamification } from '../hooks/useGamification';

const MEAL_TYPES = ['Café da Manhã', 'Almoço', 'Lanche', 'Jantar'];

export default function MealModal({ onClose, onSaveSuccess }) {
    const [mealType, setMealType] = useState('Almoço');
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const { calculateLevel } = useGamification();

    // Filter foods based on search
    const filteredFoods = searchTerm
        ? searchFoods(searchTerm).slice(0, 8)
        : commonFoods.slice(0, 10);

    // Calculate totals
    const totalCalories = selectedFoods.reduce((sum, item) =>
        sum + Math.round(item.calories * item.quantity), 0
    );

    const totalProtein = selectedFoods.reduce((sum, item) =>
        sum + (item.protein * item.quantity), 0
    );

    const totalCarbs = selectedFoods.reduce((sum, item) =>
        sum + (item.carbs * item.quantity), 0
    );

    const totalFat = selectedFoods.reduce((sum, item) =>
        sum + (item.fat * item.quantity), 0
    );

    // Add food to meal
    const handleAddFood = (food) => {
        const exists = selectedFoods.find(f => f.id === food.id);

        if (exists) {
            // Increment quantity if already added
            setSelectedFoods(selectedFoods.map(f =>
                f.id === food.id
                    ? { ...f, quantity: f.quantity + 1 }
                    : f
            ));
        } else {
            setSelectedFoods([...selectedFoods, { ...food, quantity: 1 }]);
        }

        setSearchTerm('');
    };

    // Update food quantity
    const updateQuantity = (foodId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveFood(foodId);
            return;
        }

        setSelectedFoods(selectedFoods.map(f =>
            f.id === foodId
                ? { ...f, quantity: parseFloat(newQuantity) }
                : f
        ));
    };

    // Remove food
    const handleRemoveFood = (foodId) => {
        setSelectedFoods(selectedFoods.filter(f => f.id !== foodId));
    };

    // Open photo modal
    const handleOpenPhoto = () => {
        if (selectedFoods.length === 0) {
            alert('Adicione pelo menos um alimento!');
            return;
        }

        setShowPhotoModal(true);
    };

    // Handle photo completion
    const handlePhotoComplete = () => {
        setShowPhotoModal(false);
        onSaveSuccess && onSaveSuccess();
        onClose();
    };

    const handlePhotoCancel = () => {
        setShowPhotoModal(false);
    };

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center">
                <div className="bg-gray-900 w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl animate-in slide-in-from-bottom duration-300">

                    {/* Header */}
                    <div className="sticky top-0 bg-gray-900 p-6 border-b border-white/10 flex justify-between items-center z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                                <Apple className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Registrar Refeição</h2>
                                <p className="text-sm text-gray-400">Adicione alimentos e tire foto do prato</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X className="text-white" size={24} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">

                        {/* Meal Type Selection */}
                        <div>
                            <label className="text-sm font-bold text-gray-400 mb-3 block uppercase tracking-wider">
                                Tipo de Refeição
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {MEAL_TYPES.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setMealType(type)}
                                        className={`py-3 px-4 rounded-xl font-bold text-sm transition-all ${mealType === type
                                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Food Search */}
                        <div>
                            <label className="text-sm font-bold text-gray-400 mb-3 block uppercase tracking-wider">
                                Adicionar Alimentos
                            </label>
                            <div className="relative">
                                <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar alimento (ex: arroz, frango...)"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-600 outline-none"
                                />
                            </div>

                            {/* Food Suggestions */}
                            {searchTerm && filteredFoods.length > 0 && (
                                <div className="mt-3 max-h-64 overflow-y-auto space-y-2 bg-gray-800/50 rounded-xl p-2">
                                    {filteredFoods.map(food => (
                                        <button
                                            key={food.id}
                                            onClick={() => handleAddFood(food)}
                                            className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-white group-hover:text-green-400 transition-colors">
                                                        {food.name}
                                                    </div>
                                                    <div className="text-sm text-gray-400 mt-1">
                                                        {food.serving} • {food.category}
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="font-bold text-green-400">{food.calories} kcal</div>
                                                    <div className="text-xs text-gray-500">
                                                        P: {food.protein}g C: {food.carbs}g G: {food.fat}g
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Foods */}
                        {selectedFoods.length > 0 && (
                            <div>
                                <label className="text-sm font-bold text-gray-400 mb-3 block uppercase tracking-wider">
                                    Alimentos Adicionados ({selectedFoods.length})
                                </label>
                                <div className="space-y-2">
                                    {selectedFoods.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl"
                                        >
                                            <div className="flex-1">
                                                <div className="font-semibold text-white">{item.name}</div>
                                                <div className="text-sm text-gray-400">{item.serving} cada</div>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 0.5)}
                                                    className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <input
                                                    type="number"
                                                    min="0.5"
                                                    step="0.5"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value) || 0.5)}
                                                    className="w-16 text-center bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-white font-bold focus:ring-2 focus:ring-green-600 outline-none"
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 0.5)}
                                                    className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            {/* Calories */}
                                            <div className="text-right min-w-[80px]">
                                                <div className="font-black text-green-400 text-lg">
                                                    {Math.round(item.calories * item.quantity)}
                                                </div>
                                                <div className="text-xs text-gray-500">kcal</div>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveFood(item.id)}
                                                className="p-2 bg-red-600/20 rounded-lg hover:bg-red-600/40 transition-colors"
                                            >
                                                <X size={16} className="text-red-400" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Totals */}
                        {selectedFoods.length > 0 && (
                            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-600/50 rounded-2xl p-6">
                                <div className="text-center mb-4">
                                    <div className="text-5xl font-black text-green-400 mb-1">
                                        {totalCalories}
                                    </div>
                                    <div className="text-sm text-gray-300 font-bold">Total de Calorias</div>
                                </div>

                                {/* Macros */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-black text-blue-400">
                                            {Math.round(totalProtein * 10) / 10}g
                                        </div>
                                        <div className="text-xs text-gray-400">Proteína</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-black text-yellow-400">
                                            {Math.round(totalCarbs * 10) / 10}g
                                        </div>
                                        <div className="text-xs text-gray-400">Carboidrato</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-black text-orange-400">
                                            {Math.round(totalFat * 10) / 10}g
                                        </div>
                                        <div className="text-xs text-gray-400">Gordura</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Photo Button */}
                        <button
                            onClick={handleOpenPhoto}
                            disabled={selectedFoods.length === 0}
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-black text-lg shadow-lg shadow-green-500/30 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Camera size={24} /> Fotografar Prato e Registrar
                        </button>
                    </div>
                </div>
            </div>

            {/* Photo Proof Modal */}
            {showPhotoModal && (
                <PhotoProofModal
                    actionType="meal"
                    data={{
                        mealType,
                        foods: selectedFoods,
                        totalCalories,
                        totalProtein,
                        totalCarbs,
                        totalFat,
                        notes: ''
                    }}
                    userLevel={calculateLevel(0)}
                    onComplete={handlePhotoComplete}
                    onCancel={handlePhotoCancel}
                    autoOpenCamera={true}
                />
            )}
        </>
    );
}
