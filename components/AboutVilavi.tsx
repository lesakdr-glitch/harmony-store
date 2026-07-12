'use client';

import { useEffect, useState } from 'react';

export default function AboutVilavi() {
  const [aboutText, setAboutText] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setAboutText(data.about_text || ''))
      .catch(console.error);
  }, []);

  return (
    <section className="py-16 bg-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-raleway text-3xl font-bold text-text-primary mb-8">
          О Vilavi
        </h2>
        <p className="text-lg text-text-secondary leading-relaxed">
          {aboutText}
        </p>
      </div>
    </section>
  );
}
