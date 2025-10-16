// Find more fonts at https://fonts.google.com/?vfonly=true

import { Bricolage_Grotesque, Inter, Caveat } from 'next/font/google';

export const primaryFont = Inter({ subsets: ['latin'] });

export const secondaryFont = Bricolage_Grotesque({
    subsets: ['latin'],
    variable: '--font-grotesque',
    display: 'swap',
    adjustFontFallback: false,
});

export const handwritten = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat    ',
    display: 'swap',
    weight: ['400'],
});
