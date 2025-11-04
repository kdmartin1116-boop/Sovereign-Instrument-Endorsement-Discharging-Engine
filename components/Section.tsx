
import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <section className="group">
      <h2 className="text-2xl font-bold uppercase tracking-widest mb-6 pb-3 border-b-2 border-gradient-to-r from-slate-300 to-blue-300 text-slate-800 group-hover:text-slate-900 transition-colors duration-200">
        <span className="bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <div className="transform transition-all duration-200 group-hover:translate-x-1">
        {children}
      </div>
    </section>
  );
};

export default Section;
