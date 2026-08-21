import { Work } from 'type';

export const getProjects = (): Work[] => {
  return [
    {
      id: 'devlog-2023',
      title: '기술 블로그',
      description: '바로 여기입니다.',
      createdAt: '2023-11-14',
      thumbnail:
        'https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/resume/devlog-1.png',
      github: 'https://github.com/Johnyworld/johnyworld.github.io',
      href: 'https://johnyworld.github.io',
      hasOwnPage: true,
    },
    {
      id: 'tumssum',
      title: '가계부 서비스: 틈씀이',
      description: '직접 사용하기 위해 개발한 가계부 서비스.',
      createdAt: '2022-02-28',
      thumbnail:
        'https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/resume/tumssum-1.jpg',
      github: 'https://github.com/Johnyworld/tumssum',
      hasOwnPage: true,
    },
    {
      id: 'morgan',
      title: '법률사무소 모건',
      description: '변호사 지인의 부탁을 받아 작업한 법률사무소 홈페이지.',
      createdAt: '2020-07-29',
      thumbnail:
        'https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/resume/morgan-1.jpg',
      href: 'https://morganlaw.co.kr',
      hasOwnPage: true,
    },
    {
      id: 'daylog',
      title: '데이로그',
      description:
        '시간 단위로 하루를 기록하여, 얼마나 시간을 낭비하는지 파악하기 위한 자기계발 서비스.',
      createdAt: '2019-11-04',
      thumbnail:
        'https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/thumbnail.jpg',
      hasOwnPage: true,
    },
    {
      id: 'johnyworld-2019',
      title: '2019 포트폴리오',
      description: '2019년 포트폴리오이자 리액트로 개발한 첫 사이트.',
      createdAt: '2019-07-25',
      thumbnail:
        'https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/resume/johnyworld2019-1.jpg',
      href: 'http://johnyworld2019.s3-website.ap-northeast-2.amazonaws.com/',
      hasOwnPage: true,
    },
    {
      id: 'bicpic-ent',
      title: '빅픽처 엔터테인먼트',
      description: '워드프레스 플러그인 개발.',
      createdAt: '2019-01-15',
      thumbnail:
        'https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/resume/workbg-bigpicture.jpg',
      href: 'http://bigpicture-ent.com/',
      hasOwnPage: true,
    },
  ];
};
