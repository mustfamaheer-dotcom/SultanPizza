import React from 'react'
import { motion } from 'framer-motion'

function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-header">
      <motion.h2 className="section-title" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        dangerouslySetInnerHTML={{ __html: title }} />
      {subtitle && (
        <motion.p className="section-subtitle" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
          {subtitle}
        </motion.p>
      )}
      <motion.div className="section-ornament" initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }} />
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="section" style={{ marginTop: '100vh', background: 'linear-gradient(180deg, var(--dark) 0%, var(--surface) 100%)' }}>
      <SectionTitle title='<span class="gold">Sultan</span> <span class="red">Pizza</span>' subtitle="حيث تلتقي التقاليد الإيطالية بالفخامة الشرقية" />
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', fontSize: '1.1rem', lineHeight: 2.2, color: 'var(--text-muted)' }}>
        <p>في <strong style={{ color: 'var(--gold)' }}>بيتزا السلطان</strong>، نجمع بين التقاليد الإيطالية الأصيلة واللمسة الشرقية الفاخرة. كل قطعة بيتزا تُحضّر بعناية باستخدام أفضل المكونات الطازجة، لتمنحك تجربة ملكية لا تُنسى. من البيتزا الإيطالية الكلاسيكية إلى النكهات الشرقية المبتكرة — نحن هنا لنُرضي ذوقك السلطاني.</p>
        <br />
        <p>At <strong style={{ color: 'var(--red)' }}>Sultan Pizza</strong>, we blend authentic Italian tradition with a luxurious oriental touch. Every slice is crafted with the finest fresh ingredients for a truly royal experience. From classic Italian pizzas to innovative oriental flavors — we're here to satisfy your royal taste.</p>
      </motion.div>
    </section>
  )
}
