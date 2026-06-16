'use client';

import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/categories';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function CategoryGrid() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-brand-accent mb-2">
            Browse by Category
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Find Your Sound
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              variants={itemVariants}
              className={`${
                index >= 4 ? 'md:col-span-1' : ''
              }`}
            >
              <Link
                href={`/shop?category=${category.slug}`}
                className="group relative block aspect-[4/3] sm:aspect-[3/2] rounded-xl overflow-hidden"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/70 transition-all duration-300" />

                {/* Text */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5">
                  <h3 className="text-white text-sm sm:text-lg font-bold tracking-wide uppercase leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-white/70 text-[11px] sm:text-xs mt-0.5">
                    {category.productCount} products
                  </p>
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
