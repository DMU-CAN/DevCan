export const siteCollections = {
  members: [
    { id: 'minseo', name: '김민서', photoUrl: 'assets/images/Minseo.jpg', role: 'president', roleLabel: '회장', grade: '컴퓨터소프트웨어공학과 3학년', skills: ['C', 'C++', 'JAVA', 'HTML/CSS', 'Unreal Engine 5'], order: 1 },
    { id: 'jinwoo', name: '김진우', photoUrl: 'assets/images/Jinwoo.jpg', role: 'vp', roleLabel: '부회장', grade: '컴퓨터소프트웨어공학과 3학년', skills: ['Linux', 'Network', 'Security Monitoring/SOC'], order: 2 },
    { id: 'donghyuk', name: '김동혁', photoUrl: 'assets/images/Donghyuk.png', role: 'general', roleLabel: '총무', grade: '컴퓨터소프트웨어공학과 3학년', skills: ['Node.js', 'Python', 'Backend'], order: 3 },
    { id: 'dayeon', name: '김다연', photoUrl: 'assets/images/Dayeon.jpg', role: 'general', roleLabel: '홍보부장', grade: '컴퓨터소프트웨어공학과 2학년', skills: ['Figma', 'HTML/CSS', 'JS'], order: 4 },
    { id: 'jino-academic', name: '정진오', photoUrl: 'assets/images/Jino.jpg', role: 'general', roleLabel: '학술부장', grade: '컴퓨터소프트웨어공학과 3학년', skills: ['Python', 'TypeScript', 'JavaScript', 'Kotlin', 'C', 'C++', 'C#', 'lua'], order: 5 },
    { id: 'jino-dev', name: '정진오', photoUrl: 'assets/images/Jino.jpg', role: 'general', roleLabel: '개발부장', grade: '컴퓨터소프트웨어공학과 3학년', skills: ['HTML/CSS', 'React', 'Unity', 'Django', 'Spring', 'Node.js'], order: 6 }
  ],
  activities: [
    { id: 'exam-study', icon: 'zap', title: '중간/기말고사 대비 스터디', desc: '중간/기말고사 대비 스터디를 통해 코딩 실력과 학점관리 두마리 토끼를 동시에 잡을수 있습니다.', tags: ['주 1회', '온오프라인 병행', '1/2학년 대상'], order: 1 },
    { id: 'project-team', icon: 'code-2', title: '프로젝트 팀', desc: '웹, 앱, 게임 등 다양한 분야의 팀 프로젝트를 진행하고 성과를 공유하는 시간을 가집니다.', tags: ['학기/방학', '포트폴리오', '성과공유'], order: 2 },
    { id: 'news', icon: 'rss', title: 'CAN 소식', desc: '동아리 활동 내역과 부원 근황 등 CAN의 다양한 소식을 CAN 홈페이지를 통해 공유합니다.', tags: ['정기 업로드', '최근근황', '소식'], order: 3 },
    { id: 'tutoring', icon: 'book-open', title: 'CAN 튜터링', desc: 'CAN 선배들의 코딩 노하우를 직접 배울 수 있는 튜터링 시간을 운영합니다.', tags: ['주 1회', '튜터링', 'Q&A'], order: 4 },
    { id: 'contest', icon: 'trophy', title: '대회 참가', desc: '각종 프로그래밍 대회, 공모전, 교내 대회 등에 팀으로 참가하여 실전 경험을 쌓습니다.', tags: ['실전경험', '공모전', '교내대회'], order: 5 },
    { id: 'party', icon: 'coffee', title: 'MT & 파티', desc: '학기 초 MT, 신입생 환영파티, 종강 파티 등을 통해 끈끈한 동아리 문화를 만들어갑니다.', tags: ['학기별', 'MT', '파티'], order: 6 }
  ],
  projects: [
    { id: 'sac', year: '2019', category: 'app', badge: '앱/웹', icon: 'video', title: 'SaC', subtitle: 'Streaming as a CrossPlatform', team: '3TIP (Three Terminal Internet Protocol)', desc: 'PC·Android·iOS를 아우르는 크로스플랫폼 실시간 CCTV 스트리밍 시스템. 실내 카메라를 통해 공간을 모니터링하고, 특이 상황 발생 시 즉시 알림을 발송합니다.', tags: ['Cross-Platform', 'Streaming', 'CCTV', 'Real-time'], order: 1 },
    { id: 'intro', year: '2019', category: 'app', badge: '앱', icon: 'music-2', title: 'Intro', subtitle: '입문자를 위한 음악 창작 플랫폼', team: '옥타브', desc: '음악 분야의 높은 진입장벽을 낮추기 위한 DAW 기반 음악 창작 앱. 기타·피아노·드럼 등 다양한 악기를 타임라인 방식으로 편집하고 결과물을 소셜로 공유할 수 있습니다.', tags: ['DAW', 'Music', 'Social', 'Mobile'], order: 2 },
    { id: 'network', year: '2021', category: 'game', badge: '게임', icon: 'gamepad-2', title: '네트워크', subtitle: '소규모 멀티플레이 교육 게임', team: '안정이김', desc: '소규모 네트워크 기반의 교육용 멀티플레이 게임. 퀴즈와 이동 제한, HP 시스템을 결합하며 MMR 기반 매칭으로 실력별 대전을 지원합니다.', tags: ['Network', 'Multiplayer', 'Education', 'Game'], order: 3 },
    { id: 'grida', year: '2021', category: 'env', badge: '환경', icon: 'recycle', title: '그리다', subtitle: '이미지 기반 재활용 분류 앱', team: '가오리팀', desc: '사진 한 장으로 재활용 품목을 자동 분류하는 이미지 인식 앱. RAPP 기준을 반영한 분류 가이드를 제공해 전 세계 재활용률 문제에 대응합니다.', tags: ['Image Recognition', 'Recycling', 'AI', '환경'], order: 4 },
    { id: 'ecoist-plug', year: '2021', category: 'env', badge: '환경', icon: 'leaf', title: '에코이스트 플러그', subtitle: '친환경 제품 연결 플랫폼', team: '필요하조', desc: '쓰레기 감축 캠페인을 SNS와 연동해 확산하는 플랫폼. 친환경 판매자와 소비자를 연결하고 환경 인증 기업의 제품을 쉽게 찾아 구매할 수 있도록 지원합니다.', tags: ['Platform', 'Eco-friendly', 'SNS', 'Campaign'], order: 5 },
    { id: 'opc', year: '진행중', category: 'hw', badge: '하드웨어', icon: 'cpu', title: 'OPC', subtitle: 'Open Source Controller', team: 'Nori Controller', desc: 'MPU-6050 센서·적외선 카메라·버튼으로 구성된 오픈소스 게임 컨트롤러. PC/Xbox/PlayStation 등 다양한 플랫폼에서 입력 맵핑을 자유롭게 커스터마이징할 수 있습니다.', tags: ['Hardware', 'Open Source', 'MPU-6050', 'Controller'], order: 6 }
  ],
  notices: [
    { id: 'recruit-2026-1', badge: '중요', badgeType: 'pin', icon: 'pin', title: '2026년 1학기 신입 부원 모집 공고', summary: 'CAN의 새로운 가족을 모집합니다! 지원 기간 및 방법을 확인해주세요.', date: '2026.02.20', pinned: true, order: 1, detailHtml: '<p>CAN의 새로운 가족을 모집합니다! 아직 서툴러도 괜찮아요!<br>코딩에 열정이 있는 여러분의 지원을 기다립니다.</p><p><strong>모집 기간</strong>: 2026년 2월 5일(목) ~ 3월 17일(화)</p><p><strong>지원 자격</strong>: 컴퓨터소프트웨어공학과 재학생 (1~2학년)</p><p><strong>전형 절차</strong>: 서류 접수 → 면접 (3월 18일 예정) → 최종 발표</p><p><strong>회비</strong>: 학기당 15,000원 (동아리 운영 비용)</p><p>지원서는 홈페이지 하단 <strong>CAN과 함께하기</strong> 폼을 통해 제출해주세요.</p>' },
    { id: 'ot-2025', badge: '공지', badgeType: 'default', icon: 'megaphone', title: '2025년 신입부원 OT 안내', summary: '2025년 새로운 신입부원들 대상으로 OT를 개최할 예정입니다.', date: '2025.03.21', pinned: false, order: 2, detailHtml: '<p>2025년 신입부원 OT를 아래와 같이 개최하오니 전원 참석 바랍니다.</p><p><strong>일시</strong>: 2025년 3월 21일</p><p><strong>장소</strong>: 3호관 109-2호</p><p><strong>안건</strong>: 임원진 소개, 2025년 스터디 계획 공유 등등..</p><p>불참 시 사전에 회장에게 연락 바랍니다.</p>' },
    { id: 'welcome-dinner-2025', badge: '행사', badgeType: 'event', icon: 'calendar-check', title: '2025 신입생 환영 회식 일정 공지', summary: '신입생 환영 회식 일정이 확정되었습니다.', date: '2025.04.10', pinned: false, order: 3, detailHtml: '<p>2025년 신입생 환영 회식 일정이 조율되었습니다. 신입 부원은 반드시 참석해주세요.</p><p><strong>장소</strong>: 포차천국 고척점</p><p><strong>내용</strong>: 동아리 소개, 선후배 교류, 스터디 팀 안내</p><p>문의 사항은 회장 또는 총무에게 연락해주세요.</p>' },
    { id: 'study-2025-2', badge: '학술', badgeType: 'default', icon: 'book-open', title: '2학기 웹/게임 스터디 팀 모집', summary: '웹/게임 스터디 팀을 모집합니다. 1학년부터 3학년까지 섞은 팀으로 운영됩니다.', date: '2025.08.04', pinned: false, order: 4, detailHtml: '<p>2학기 웹/게임 스터디 팀을 모집합니다. 레벨별로 운영되니 부담 없이 신청하세요.</p><p><strong>모집 학년</strong>: 1학년 ~ 3학년</p><p><strong>활동 방식</strong>: 자율적, 2주에 진행상황 리뷰 및 코드 리뷰</p><p><strong>신청 방법</strong>: 학술부장에게 카카오톡 오픈채팅으로 연락</p>' },
    { id: 'tutoring-2025-2', badge: '소식', badgeType: 'default', icon: 'rss', title: '2025 2학기 튜터링 공지', summary: '2025 2학기 동아리 내 튜터링 공지', date: '2025.08.04', pinned: false, order: 5, detailHtml: '<p>2025 2학기 선배들과 함께하는 튜터링을 진행할 예정입니다.</p><p><strong>일정 및 장소</strong>: 추후에 배정될 튜터와 조율</p><p><strong>대상 과목</strong>: C , JAVA , Linux , HTML/CSS</p><p>오픈채팅으로 튜터링 관련 문의 가능</p>' },
    { id: 'snacks-2025', badge: '학술', badgeType: 'default', icon: 'file-text', title: '동아리방 내 새로운 비품 및 다과 보충', summary: '동아리방 내 새로운 비품이 추가되었고, 다과도 보충되었습니다!!!!!', date: '2025.11.13', pinned: false, order: 6, detailHtml: '<p>총 8개 팀이 발표를 진행하였으며, 아래와 같이 시상하였습니다.</p><p><strong>추가된 비품목록 </strong>공기청정기 , 프린터기 , 커피포트 , 대형칠판 , 보드마카류 , A4용지</p><p><strong>추가된 다과목록 </strong>오예스미니 , 초코하임 , 화이트하임 , 쿠크다스 , 촉촉한초코칩 , 빈츠 , 엄마손 , 마가렛트 , 오뜨치즈 , 후렌치파이 소라과자</p><p>동아리방 많이 이용 부탁드립니다!!</p>' }
  ],
  gallery: [
    { id: 'blackboard', imageUrl: 'assets/images/int.jpg', storagePath: '', size: 'normal', category: 'news', title: '칠판에 누가 그렸냐', date: '2025.11', order: 1 },
    { id: 'ot-2025', imageUrl: 'assets/images/OT.png', storagePath: '', size: 'large', category: 'study', title: '2025 신입생 OT', date: '2025.03', order: 2 },
    { id: 'party-2025', imageUrl: 'assets/images/sul1.jpg', storagePath: '', size: 'normal', category: 'event', title: '2025년 2학기 종강파티', date: '2024.12', order: 3 },
    { id: 'project-award-1', imageUrl: 'assets/images/sang1.jpg', storagePath: '', size: 'normal', category: 'project', title: '너무너무 고생하셨어요!!!', date: '2023.12', order: 4 },
    { id: 'mt-2025', imageUrl: 'assets/images/mt1.jpg', storagePath: '', size: 'tall', category: 'event', title: '2025년 하반기 MT', date: '2026.01', order: 5 },
    { id: 'snacks-room', imageUrl: 'assets/images/sn2.jpg', storagePath: '', size: 'normal', category: 'news', title: '과자 먹으러 오세요..!', date: '2025.11', order: 6 },
    { id: 'snacks-arrived', imageUrl: 'assets/images/sn1.jpg', storagePath: '', size: 'normal', category: 'study', title: '주문한 과자들 도착했습니다!!!!!!!!!!!!', date: '2025.05', order: 7 },
    { id: 'project-award-2', imageUrl: 'assets/images/sang2.jpg', storagePath: '', size: 'normal', category: 'project', title: '동양미래대 EXPO 수상!', date: '2024.11', order: 8 }
  ]
};

export const seedCollections = siteCollections;
