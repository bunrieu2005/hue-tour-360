export const VILLAGE_IMAGES: Record<string, string> = {
    'sinh-painting': '/tranhlangsinh-img/backroud-tranhlangsinh.png',
    'thanh-tien-paper-flower':
        'https://images.unsplash.com/photo-1578409682213-e27b3355cad7?w=800&h=500&fit=crop&auto=format',
    'thuy-xuan-incense':
        'https://images.unsplash.com/photo-1480742440191-ab4ea2aac8e7?w=800&h=500&fit=crop&auto=format',
    'non-la-conical-hat':
        'https://images.unsplash.com/photo-1472087982327-49192446ed6b?w=800&h=500&fit=crop&auto=format',
    'phap-lam-enamel':
        'https://images.unsplash.com/photo-1668184599395-14e6a15fadcb?w=800&h=500&fit=crop&auto=format',
    'phuoc-tich-pottery':
        'https://images.unsplash.com/photo-1760894192884-37a7037200ba?w=800&h=500&fit=crop&auto=format',
    'a-luoi-weaving':
        'https://images.unsplash.com/photo-1676294990266-f6283e77ee48?w=800&h=500&fit=crop&auto=format',
    'kim-long-woodwork':
        'https://images.unsplash.com/photo-1679108229360-8b6e996d9034?w=800&h=500&fit=crop&auto=format',
};

export const VILLAGE_METADATA: Record<
    string,
    {
        category: 'unesco' | 'royal' | 'folk';
        heritageTag: { vi: string; en: string; sign: string };
        gradientFrom: string;
        gradientTo: string;
        badgeBorder: string;
    }
> = {
    'sinh-painting': {
        category: 'unesco',
        heritageTag: { vi: 'Di sản UNESCO 2021', en: 'UNESCO Heritage 2021', sign: 'UNESCO 2021 🎨' },
        gradientFrom: '#8B1A00',
        gradientTo: '#C05010',
        badgeBorder: '#F59E0B',
    },
    'thanh-tien-paper-flower': {
        category: 'folk',
        heritageTag: { vi: 'Biểu tượng Tết Xứ Huế', en: 'Tet Spring Cultural Icon', sign: 'Hoa Tết Xứ Huế 🌸' },
        gradientFrom: '#154A28',
        gradientTo: '#2D7D45',
        badgeBorder: '#34D399',
    },
    'thuy-xuan-incense': {
        category: 'folk',
        heritageTag: { vi: 'Sắc Màu Dưới Chân Vọng Cảnh', en: 'Vibrant Colors of Vong Canh', sign: 'Sắc Màu Làng Hương 🌿' },
        gradientFrom: '#4A1D6B',
        gradientTo: '#7B2CBF',
        badgeBorder: '#C084FC',
    },
    'non-la-conical-hat': {
        category: 'folk',
        heritageTag: { vi: 'Nét Duyên Nón Bài Thơ', en: 'Grace of Poem Conical Hat', sign: 'Nón Lá Bài Thơ 👒' },
        gradientFrom: '#1E3A8A',
        gradientTo: '#2563EB',
        badgeBorder: '#60A5FA',
    },
    'phap-lam-enamel': {
        category: 'royal',
        heritageTag: { vi: 'Xưởng Hoàng Gia Triều Nguyễn', en: 'Nguyen Royal Workshop Art', sign: 'Pháp Lam Hoàng Gia 🏺' },
        gradientFrom: '#0B2559',
        gradientTo: '#1D4ED8',
        badgeBorder: '#FBBF24',
    },
    'phuoc-tich-pottery': {
        category: 'unesco',
        heritageTag: { vi: 'Làng Cổ 500 Năm Tuổi', en: '500-Year Ancient Village', sign: 'Làng Cổ 500 Năm 🏺' },
        gradientFrom: '#78350F',
        gradientTo: '#B45309',
        badgeBorder: '#F59E0B',
    },
    'a-luoi-weaving': {
        category: 'unesco',
        heritageTag: { vi: 'UNESCO Cần Bảo Vệ Khẩn Cấp', en: 'UNESCO Urgent Safeguarding', sign: 'UNESCO Dệt Zèng 🧵' },
        gradientFrom: '#14532D',
        gradientTo: '#15803D',
        badgeBorder: '#4ADE80',
    },
    'kim-long-woodwork': {
        category: 'royal',
        heritageTag: { vi: 'Nội Thất Cung Đình Triều Nguyễn', en: 'Royal Court Woodcraft Heritage', sign: 'Mộc Cung Đình 🪵' },
        gradientFrom: '#451A03',
        gradientTo: '#92400E',
        badgeBorder: '#F59E0B',
    },
};