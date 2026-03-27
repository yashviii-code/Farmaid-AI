import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, MapPin, Calendar, Zap, Droplets, Thermometer, CloudRain, Camera, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCopy } from '../lib/getLocalizedCopy';

const LOCATIONS = [
  { name: 'Punjab', temp: 28, rainfall: 650, season: 'Kharif' },
  { name: 'Maharashtra', temp: 30, rainfall: 1200, season: 'Kharif' },
  { name: 'Gujarat', temp: 32, rainfall: 800, season: 'Rabi' },
  { name: 'Haryana', temp: 27, rainfall: 550, season: 'Rabi' },
  { name: 'Uttar Pradesh', temp: 29, rainfall: 900, season: 'Kharif' },
  { name: 'Karnataka', temp: 26, rainfall: 1000, season: 'Kharif' },
];

const SEASONS = ['Kharif', 'Rabi', 'Zaid', 'Summer', 'Winter', 'Kharif (Monsoon)'];

const CROP_RECOMMENDATION_COPY = {
  english: {
    title: 'Crop Recommendation System',
    subtitle: 'AI-powered crop selection based on your farm data',
    tabs: {
      form: 'Manual Entry (Sliders)',
      ocr: 'Scan Lab Report (OCR)',
    },
    labels: {
      location: 'Location',
      season: 'Season',
      soilNutrients: 'Soil Nutrients (NPK)',
      environmentalFactors: 'Environmental Factors',
      nitrogen: 'Nitrogen (N)',
      phosphorus: 'Phosphorus (P)',
      potassium: 'Potassium (K)',
      temperature: 'Temperature (°C)',
      humidity: 'Humidity (%)',
      soilPh: 'Soil pH',
      rainfall: 'Rainfall (mm)',
    },
    placeholders: {
      location: 'Enter city or region',
      season: 'Select Season...',
    },
    helper: {
      location: 'Auto-fills weather data if location found',
    },
    buttons: {
      analyze: 'Get AI Recommendation →',
      analyzing: 'Analyzing Data...',
      takePhoto: 'Take Photo',
      browseFiles: 'Browse Files',
    },
    results: {
      title: 'Recommended Crops',
      analysis: 'Analysis',
      match: 'Match',
    },
    ocr: {
      title: 'Upload Soil Test Report',
      description: 'Take a photo or upload a PDF of your laboratory soil test report. Our AI will automatically extract the nutrient values.',
    },
    errors: {
      failedRecommendations: 'Failed to get recommendations.',
      backendUnavailable: 'An error occurred. Make sure the backend server is running on port 5001.',
    },
  },
  hindi: {
    title: 'फसल सिफारिश प्रणाली',
    subtitle: 'आपके खेत के डेटा पर आधारित एआई-संचालित फसल चयन',
    tabs: {
      form: 'मैनुअल एंट्री (स्लाइडर)',
      ocr: 'लैब रिपोर्ट स्कैन करें (OCR)',
    },
    labels: {
      location: 'स्थान',
      season: 'मौसम',
      soilNutrients: 'मिट्टी के पोषक तत्व (NPK)',
      environmentalFactors: 'पर्यावरणीय कारक',
      nitrogen: 'नाइट्रोजन (N)',
      phosphorus: 'फॉस्फोरस (P)',
      potassium: 'पोटैशियम (K)',
      temperature: 'तापमान (°C)',
      humidity: 'आर्द्रता (%)',
      soilPh: 'मिट्टी pH',
      rainfall: 'वर्षा (मिमी)',
    },
    placeholders: {
      location: 'शहर या क्षेत्र दर्ज करें',
      season: 'मौसम चुनें...',
    },
    helper: {
      location: 'स्थान मिलने पर मौसम डेटा स्वतः भर जाता है',
    },
    buttons: {
      analyze: 'एआई सिफारिश प्राप्त करें →',
      analyzing: 'डेटा का विश्लेषण हो रहा है...',
      takePhoto: 'फोटो लें',
      browseFiles: 'फाइलें चुनें',
    },
    results: {
      title: 'सिफारिश की गई फसलें',
      analysis: 'विश्लेषण',
      match: 'मिलान',
    },
    ocr: {
      title: 'मिट्टी परीक्षण रिपोर्ट अपलोड करें',
      description: 'अपनी प्रयोगशाला मिट्टी परीक्षण रिपोर्ट की फोटो लें या PDF अपलोड करें। हमारा एआई पोषक तत्वों के मान स्वतः निकाल लेगा।',
    },
    errors: {
      failedRecommendations: 'सिफारिशें प्राप्त नहीं हो सकीं।',
      backendUnavailable: 'एक त्रुटि हुई। कृपया सुनिश्चित करें कि बैकएंड सर्वर पोर्ट 5001 पर चल रहा है।',
    },
  },
  gujarati: {
    title: 'પાક ભલામણ સિસ્ટમ',
    subtitle: 'તમારા ફાર્મ ડેટા પર આધારિત એઆઇ આધારિત પાક પસંદગી',
    tabs: {
      form: 'મેન્યુઅલ એન્ટ્રી (સ્લાઇડર)',
      ocr: 'લેબ રિપોર્ટ સ્કેન કરો (OCR)',
    },
    labels: {
      location: 'સ્થાન',
      season: 'સીઝન',
      soilNutrients: 'માટીના પોષક તત્વો (NPK)',
      environmentalFactors: 'પર્યાવરણીય પરિબળો',
      nitrogen: 'નાઇટ્રોજન (N)',
      phosphorus: 'ફોસ્ફરસ (P)',
      potassium: 'પોટેશિયમ (K)',
      temperature: 'તાપમાન (°C)',
      humidity: 'ભેજ (%)',
      soilPh: 'માટી pH',
      rainfall: 'વરસાદ (મિ.મી.)',
    },
    placeholders: {
      location: 'શહેર અથવા વિસ્તાર દાખલ કરો',
      season: 'સીઝન પસંદ કરો...',
    },
    helper: {
      location: 'સ્થાન મળતા હવામાન ડેટા આપમેળે ભરાય છે',
    },
    buttons: {
      analyze: 'એઆઇ ભલામણ મેળવો →',
      analyzing: 'ડેટાનું વિશ્લેષણ થઈ રહ્યું છે...',
      takePhoto: 'ફોટો લો',
      browseFiles: 'ફાઇલ પસંદ કરો',
    },
    results: {
      title: 'ભલામણ કરેલા પાકો',
      analysis: 'વિશ્લેષણ',
      match: 'મેચ',
    },
    ocr: {
      title: 'માટી પરીક્ષણ રિપોર્ટ અપલોડ કરો',
      description: 'તમારી લેબોરેટરી માટી પરીક્ષણ રિપોર્ટનો ફોટો લો અથવા PDF અપલોડ કરો. અમારું એઆઇ પોષક તત્વોની કિંમતો આપમેળે બહાર કાઢશે.',
    },
    errors: {
      failedRecommendations: 'ભલામણો મેળવવામાં નિષ્ફળતા.',
      backendUnavailable: 'ભૂલ આવી. ખાતરી કરો કે બેકએન્ડ સર્વર 5001 પોર્ટ પર ચાલુ છે.',
    },
  },
};

const SliderCard = ({ icon: Icon, label, field, value, min, max, isEnvironmental, colorClass, thumbClass, onChange }) => (
  <div className="bg-[#111c2a] border border-[#1e293b] rounded-2xl p-6">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        {isEnvironmental && Icon && <Icon className={`w-5 h-5 ${colorClass}`} />}
        <span className="text-slate-300 font-medium text-sm md:text-base">{label}</span>
      </div>
      <span className="text-white font-bold text-lg">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step="1"
      value={value}
      onChange={(e) => onChange(field, parseFloat(e.target.value))}
      className={`w-full h-1.5 bg-[#1e293b] rounded-full appearance-none cursor-pointer ${thumbClass}`}
    />
  </div>
);

export function CropRecommendation() {
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, CROP_RECOMMENDATION_COPY);
  const [activeTab, setActiveTab] = useState('form');
  const [soilData, setSoilData] = useState({
    nitrogen: 50,
    phosphorus: 50,
    potassium: 50,
    ph: 6.5,
    temperature: 25,
    humidity: 50,
    rainfall: 100,
    season: 'Kharif (Monsoon)',
  });
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    const locationData = LOCATIONS.find(l => l.name === location);
    if (locationData) {
      setSoilData(prev => ({
        ...prev,
        temperature: locationData.temp,
        rainfall: locationData.rainfall,
        season: locationData.season,
      }));
    }
  };

  const handleSliderChange = (field, value) => {
    setSoilData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setShowResults(false);
    
    try {
      const response = await fetch("http://localhost:5001/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: soilData.nitrogen,
          P: soilData.phosphorus,
          K: soilData.potassium,
          temperature: soilData.temperature,
          humidity: soilData.humidity,
          ph: soilData.ph,
          rainfall: soilData.rainfall,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations);
        setExplanation(data.explanation);
        setShowResults(true);
      } else {
        alert(data.error || copy.errors.failedRecommendations);
      }
    } catch (error) {
      console.error("Prediction error:", error);
      alert(copy.errors.backendUnavailable);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 font-sans">
      {/* Header section matching Figma */}
      <div className="flex items-center gap-5 mb-12">
        <div className="w-16 h-16 bg-[#00d084] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(0,208,132,0.3)]">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#00d084] mb-1 tracking-tight">{copy.title}</h1>
          <p className="text-slate-400 text-sm md:text-base font-medium">{copy.subtitle}</p>
        </div>
      </div>

      {/* Modern Pill Tab Switcher */}
      <div className="flex bg-[#0b131e] rounded-[2.5rem] p-2 mx-auto w-full max-w-3xl border border-[#1e293b]">
        <button
          onClick={() => setActiveTab('form')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold transition-all text-[15px] ${
            activeTab === 'form' 
              ? 'bg-[#00d084] text-[#0b131e] shadow-lg shadow-[#00d084]/20' 
              : 'text-slate-400 hover:text-white hover:bg-[#1e293b]/50'
          }`}
        >
          {copy.tabs.form}
        </button>
        <button
          onClick={() => setActiveTab('ocr')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold transition-all text-[15px] ${
            activeTab === 'ocr' 
              ? 'bg-[#0ea5e9] text-white shadow-lg shadow-[#0ea5e9]/20' 
              : 'text-slate-400 hover:text-white hover:bg-[#1e293b]/50'
          }`}
        >
          <FileText size={18} />
          {copy.tabs.ocr}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#0b131e] rounded-[2rem] p-6 md:p-10 border border-[#1e293b]">
        {activeTab === 'form' ? (
          <div className="space-y-12">
            
            {/* Top row: Location & Season */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#111c2a] border border-[#1e293b] rounded-2xl p-6">
                <label className="flex items-center gap-2 text-slate-300 font-semibold mb-4 text-sm">
                  <MapPin className="text-[#00d084]" size={16} />
                  {copy.labels.location}
                </label>
                <input
                  type="text"
                  placeholder={copy.placeholders.location}
                  value={selectedLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full bg-[#0b131e] border border-[#1e293b] rounded-xl px-4 py-3.5 text-white focus:border-[#00d084] focus:ring-1 focus:ring-[#00d084] outline-none transition-all placeholder-slate-600 font-medium"
                />
                <p className="text-[#00d084] text-xs font-medium mt-3 tracking-wide">{copy.helper.location}</p>
              </div>
              
              <div className="bg-[#111c2a] border border-[#1e293b] rounded-2xl p-6">
                <label className="flex items-center gap-2 text-slate-300 font-semibold mb-4 text-sm">
                  <Calendar className="text-[#00d084]" size={16} />
                  {copy.labels.season}
                </label>
                <select
                  value={soilData.season}
                  onChange={(e) => setSoilData({ ...soilData, season: e.target.value })}
                  className="w-full bg-[#0b131e] border border-[#1e293b] rounded-xl px-4 py-3.5 text-white focus:border-[#00d084] focus:ring-1 focus:ring-[#00d084] outline-none transition-all cursor-pointer font-medium appearance-none"
                >
                  <option value="" className="bg-[#111c2a]">{copy.placeholders.season}</option>
                  {SEASONS.map((season) => (
                    <option key={season} value={season} className="bg-[#111c2a]">{season}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* NPK Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-[#00d084] rounded-full"></div>
                <h2 className="text-xl font-bold text-white tracking-wide">{copy.labels.soilNutrients}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SliderCard label={copy.labels.nitrogen} field="nitrogen" value={soilData.nitrogen} min={0} max={140} isEnvironmental={false} thumbClass="accent-[#00d084]" onChange={handleSliderChange} />
                <SliderCard label={copy.labels.phosphorus} field="phosphorus" value={soilData.phosphorus} min={0} max={145} isEnvironmental={false} thumbClass="accent-[#00d084]" onChange={handleSliderChange} />
                <SliderCard label={copy.labels.potassium} field="potassium" value={soilData.potassium} min={0} max={205} isEnvironmental={false} thumbClass="accent-[#00d084]" onChange={handleSliderChange} />
              </div>
            </div>

            {/* Environmental Factors Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-[#3b82f6] rounded-full"></div>
                <h2 className="text-xl font-bold text-white tracking-wide">{copy.labels.environmentalFactors}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SliderCard icon={Thermometer} label={copy.labels.temperature} field="temperature" value={soilData.temperature} min={0} max={50} isEnvironmental={true} colorClass="text-[#3b82f6]" thumbClass="accent-[#3b82f6]" onChange={handleSliderChange} />
                <SliderCard icon={Droplets} label={copy.labels.humidity} field="humidity" value={soilData.humidity} min={0} max={100} isEnvironmental={true} colorClass="text-[#3b82f6]" thumbClass="accent-[#3b82f6]" onChange={handleSliderChange} />
                <SliderCard icon={Zap} label={copy.labels.soilPh} field="ph" value={soilData.ph} min={1} max={14} isEnvironmental={true} colorClass="text-[#3b82f6]" thumbClass="accent-[#3b82f6]" onChange={handleSliderChange} />
                <SliderCard icon={CloudRain} label={copy.labels.rainfall} field="rainfall" value={soilData.rainfall} min={0} max={300} isEnvironmental={true} colorClass="text-[#3b82f6]" thumbClass="accent-[#3b82f6]" onChange={handleSliderChange} />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#00d084] hover:bg-[#00e090] text-[#0b131e] font-bold text-[17px] py-5 rounded-[1rem] flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-6"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-[#0b131e] border-t-transparent rounded-full animate-spin"></div>
                  {copy.buttons.analyzing}
                </span>
              ) : (
                <>
                  <Zap className="fill-current" size={20} />
                  {copy.buttons.analyze}
                </>
              )}
            </motion.button>
            
            {showResults && recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111c2a] border border-[#1e293b] rounded-2xl p-6 mt-8"
              >
                <h3 className="text-lg font-bold text-white mb-4">{copy.results.title}</h3>
                <div className="bg-[#0b131e] border border-[#1e293b] p-4 rounded-xl text-slate-300 text-sm mb-6">
                  <strong>{copy.results.analysis}: </strong> {explanation}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recommendations.map((cropObj, index) => {
                    const confPercent = Math.round(cropObj.confidence * 100);
                    return (
                      <div key={cropObj.crop} className="bg-[#0b131e] border border-[#1e293b] rounded-xl p-4 flex flex-col items-center">
                        <div className="w-14 h-14 bg-[#111c2a] rounded-full flex items-center justify-center mb-3 text-2xl">
                          🌱
                        </div>
                        <h4 className="text-white font-bold uppercase mb-1">{cropObj.crop}</h4>
                        <div className="text-[#00d084] font-bold text-sm bg-[#00d084]/10 px-3 py-1 rounded-full">
                          {confPercent}% {copy.results.match}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          // OCR Tab Implementation matching Figma Image 3 exactly
          <div className="py-8 md:py-16">
            <div className="w-full max-w-3xl mx-auto border-2 border-dashed border-[#1e293b] bg-[#0b131e] rounded-[2rem] p-10 md:p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-b from-[#0ea5e9] to-[#0284c7] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#0ea5e9]/20">
                <Upload className="text-white w-10 h-10" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{copy.ocr.title}</h2>
              <p className="text-slate-400 mb-10 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                {copy.ocr.description}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white hover:bg-slate-100 text-[#0f172a] font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
                  <Camera size={18} strokeWidth={2.5} />
                  {copy.buttons.takePhoto}
                </button>
                <button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold py-3.5 px-8 rounded-xl transition-colors text-sm">
                  {copy.buttons.browseFiles}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
