// sliderData
export const slideTitles = ['포켓몬스터', '국립중앙박물관', '포트폴리오'];

export const slideDescriptions = [
    '포켓몬스터 한국 공식 사이트',
    '국립중앙박물관 전시 안내 사이트',
    '여행 모티브 인터랙티브 포트폴리오',
];

export const imageUrls = ['images/project-1.png', 'images/project-3.jpg', 'images/project-4.png'];

export const buttonConfigs = [['View Website'], ['View Website'], ['View Website']];

export const buttonLinks = [
    ['https://example.com/hogangs'],
    ['https://museum-ebon.vercel.app/'],
    ['https://portfolio-nu-nine-33.vercel.app/'],
];

// team - projectCards .data
export const projectCards = [
    {
        id: 'hogangs',
        category: 'ios & Web APP Design',
        title: 'HOGANGS',
        subtitle: '호텔 예약과 OTT를 동시에',
        image: 'images/list1.png', // ✅ 문자열, 객체 아님!
        alt: '호강스',
        modalTarget: '#modal-hogangs',
        period: '2025.08.20 ~2025.09.23 (4week)',
        skills: [
            // ✅ 이것도 문자열 배열로
            'images/logo-react.png',
            'images/logo-scss.png',
        ],
    },
    {
        id: 'loccitane',
        category: 'ios & Web APP Design',
        title: 'L’OCCITANE',
        subtitle: '당신을 위한 선물 더 쉽고 간단하게',
        image: 'images/list2.png',
        alt: '록시땅',
        modalTarget: '#modal-loccitane',
        period: '2025.07.18 ~2025.08.18 (4week)',
        skills: ['images/logo-react.png', 'images/logo-css.png'],
    },
    {
        id: 'asan',
        category: 'Web UI/UX r.design',
        title: '서울아산병원',
        subtitle: '믿음 위에 디자인을 더하다',
        image: 'images/list3.png',
        alt: '서울아산병원',
        modalTarget: '#modal-asan',
        period: '2025.07.01 ~2025.07.10 (1week)',
        skills: ['images/logo-html.png', 'images/logo-js.png', 'images/logo-css.png'],
    },
    {
        id: 'mcdelivery',
        category: 'ios APP r.design',
        title: 'McDelivery',
        subtitle: '맥도날드 배달, 이제 더 쉽게!',
        image: 'images/list4.png',
        alt: '맥딜리버리',
        modalTarget: '#modal-mcdelivery',
        period: '2025.04.09 ~2025.04.15 (1week)',
        skills: ['images/logo-pigma.png'],
    },
];
