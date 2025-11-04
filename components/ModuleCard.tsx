
import React from 'react';

interface ModuleCardProps {
  name: string;
  description: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ name, description }) => {
  return (
    <div className="group bg-white/70 backdrop-blur-sm border border-slate-200/60 p-6 rounded-xl shadow-lg hover:shadow-xl hover:border-blue-300/60 hover:bg-white/80 transition-all duration-300 h-full transform hover:-translate-y-1 cursor-pointer">
      <div className="flex items-center mb-3">
        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-3 group-hover:animate-pulse"></div>
        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-700 transition-colors">
          {name}
        </h3>
      </div>
      <p className="text-slate-600 group-hover:text-slate-700 transition-colors leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ModuleCard;
