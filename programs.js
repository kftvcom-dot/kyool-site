// HPI 1.4-G
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { WelcomePopup, useWelcomePopup } from '@/components/ui/welcome-popup';
import { SecureAccessPopup } from '@/components/ui/secure-access-popup';
import { Play, ArrowRight, Calendar, User, Tv, Clapperboard, Newspaper, Star, TrendingUp, X, ChevronLeft, ChevronRight, Clock, Eye, Heart, Share2 } from 'lucide-react';

interface AnimateOnScrollOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

const useAnimateOnScroll = (options: AnimateOnScrollOptions) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const { triggerOnce, ...observerOptions } = options;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (triggerOnce) {
          observer.unobserve(entry.target);
        }
      }
    }, observerOptions);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible] as const;
};

const SectionHeader = ({ number, title, subtitle, className = '' }: {
  number: string;
  title: string;
  subtitle?: string;
  className?: string;
}) => {
  const [ref, isVisible] = useAnimateOnScroll({ threshold: 0.1, triggerOnce: true });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`scroll-fade-in ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      <div className="flex items-center gap-4">
        <span className="font-heading text-primary text-lg">{number}</span>
        <div className="h-px flex-grow bg-gradient-to-r from-primary/50 to-secondary/50"></div>
      </div>
      <h2 className="mt-4 text-4xl font-bold font-heading md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
        {title}
      </h2>
      {subtitle && <p className="mt-4 max-w-2xl text-lg text-foreground/70">{subtitle}</p>}
    </div>
  );
};

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [currentProgramIndex, setCurrentProgramIndex] = useState(0);
  const welcomePopup = useWelcomePopup();
  
  // Secure Access Popup State
  const [showSecureAccess, setShowSecureAccess] = useState(false);
  const [secureAccessValidated, setSecureAccessValidated] = useState(false);

  // Check if secure access popup should be shown
  useEffect(() => {
    // Target date: November 1st, 2025 at 14:00 Paris time
    const targetDate = new Date('2025-11-01T14:00:00+01:00');
    const now = new Date();
    
    // Only show secure access popup before the target date
    if (now < targetDate) {
      const hasValidatedSecureAccess = localStorage.getItem('kyool_secure_access');
      const hasSeenSecureAccessPopup = localStorage.getItem('kyool-secure-access-popup-seen');
      
      if (!hasValidatedSecureAccess && !hasSeenSecureAccessPopup) {
        // Disable auto-show of welcome popup since secure access is required first
        welcomePopup.disableAutoShow();
        
        // Show secure access popup after a short delay
        const timer = setTimeout(() => {
          setShowSecureAccess(true);
        }, 1000); // 1 second delay
        
        return () => clearTimeout(timer);
      } else {
        // User has already validated secure access or seen the popup
        setSecureAccessValidated(true);
      }
    } else {
      // After target date, secure access is no longer needed
      setSecureAccessValidated(true);
    }
  }, [welcomePopup]);

  const handleSecureAccessValidated = () => {
    setShowSecureAccess(false);
    setSecureAccessValidated(true);
    
    // After secure access validation, show welcome popup if not seen
    const hasSeenWelcomePopup = localStorage.getItem('kyool-welcome-popup-seen');
    if (!hasSeenWelcomePopup) {
      // Small delay before showing welcome popup
      setTimeout(() => {
        welcomePopup.setIsOpen(true);
      }, 500);
    }
  };

  const handleSecureAccessClose = () => {
    setShowSecureAccess(false);
    // Mark that the user has seen the secure access popup to prevent it from showing again
    localStorage.setItem('kyool-secure-access-popup-seen', 'true');
  };

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProgramIndex(prev => (prev + 1) % Math.ceil(top10KyoolPrograms.length / 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextPrograms = () => {
    setCurrentProgramIndex(prev => (prev + 1) % Math.ceil(top10KyoolPrograms.length / 5));
  };

  const prevPrograms = () => {
    setCurrentProgramIndex(prev => prev === 0 ? Math.ceil(top10KyoolPrograms.length / 5) - 1 : prev - 1);
  };

  const featuredCategories = [
    {
      title: 'K-Dramas',
      description: 'Les dernières séries coréennes',
      image: 'https://static.wixstatic.com/media/48063d_edbead4ea7f44defbb11d909de6d48ab~mv2.png?originWidth=768&originHeight=576',
      link: '/articles/k-dramas'
    },
    {
      title: 'K-Pop',
      description: 'Actualités et tendances musicales',
      image: 'https://static.wixstatic.com/media/48063d_57ccdb3285774c568c203d3a0ece88de~mv2.png?originWidth=768&originHeight=576',
      link: '/articles/k-pop'
    },
    {
      title: 'Lifestyle',
      description: 'Tendances, mode et vie quotidienne',
      image: 'https://static.wixstatic.com/media/48063d_6b4c5072c5f34b1d843767e66ab8a3f8~mv2.png?originWidth=768&originHeight=576',
      link: '/articles/voyage'
    },
    {
      title: 'Cuisine',
      description: 'Recettes et culture culinaire',
      image: 'https://static.wixstatic.com/media/48063d_34ed23cd7dcb48acb2c1ebd861773227~mv2.png?originWidth=768&originHeight=576',
      link: '/articles/cuisine'
    },
    {
      title: 'Short-drama',
      description: 'Mini-séries et contenus courts',
      image: 'https://static.wixstatic.com/media/48063d_cc2631c4712d4cabbc03c21a04a5e20a~mv2.png?originWidth=768&originHeight=576',
      link: '/articles/short-dramas'
    },
  ];

  const latestArticles = [
    {
      id: 1,
      title: 'Les K-Dramas les plus attendus de 2024',
      excerpt: 'Plongez au cœur des productions coréennes qui vont marquer cette année, entre retours de stars et scénarios innovants qui promettent de captiver les spectateurs du monde entier.',
      image: 'https://static.wixstatic.com/media/48063d_e69f33d9b35f43a9ac1d6494ef4725c3~mv2.png?originWidth=640&originHeight=384',
      category: 'K-Dramas',
      date: '2024-01-15',
      author: 'Sarah Kim'
    },
    {
      id: 2,
      title: 'NewJeans révolutionne la K-Pop avec un son novateur',
      excerpt: 'Le groupe féminin continue de battre des records, redéfinissant les codes de la K-Pop avec une esthétique et une musique uniques.',
      image: 'https://static.wixstatic.com/media/48063d_4dc9ec42ada14b579574177004a5def0~mv2.png?originWidth=640&originHeight=384',
      category: 'K-Pop',
      date: '2024-01-14',
      author: 'Alex Park'
    },
    {
      id: 3,
      title: 'La recette authentique du Kimchi Jjigae pour les jours froids',
      excerpt: 'Apprenez à préparer ce ragoût traditionnel coréen, un plat réconfortant et riche en saveurs, parfait pour se réchauffer.',
      image: 'https://static.wixstatic.com/media/48063d_fca29ab7a9c74fb1b18194a1682308b6~mv2.png?originWidth=640&originHeight=384',
      category: 'Cuisine',
      date: '2024-01-13',
      author: 'Min Jung'
    }
  ];
  
  const videoOfTheMonth = {
      title: 'Seoul by Night: A Cinematic Journey',
      description: 'Explorez les rues vibrantes de Séoul à la tombée de la nuit dans ce court métrage exclusif de Kyool TV. Des néons de Gangnam aux marchés nocturnes traditionnels, une immersion visuelle et sonore au cœur de la capitale sud-coréenne.',
      image: 'https://static.wixstatic.com/media/48063d_a59c1c6ed1a947f4960ee9556fe9f15e~mv2.png?originWidth=1600&originHeight=896',
      duration: '04:38',
      link: '/videos/seoul-by-night'
  };

  const top10KyoolPrograms = [
    {
      id: 1,
      title: 'My Demon',
      category: 'K-Drama Romance',
      poster: 'https://static.wixstatic.com/media/48063d_cc2631c4712d4cabbc03c21a04a5e20a~mv2.png?originWidth=576&originHeight=256',
      rating: '9.2',
      link: 'https://kyool.eu/programs/my-demon'
    },
    {
      id: 2,
      title: 'Queen of Tears',
      category: 'K-Drama Famille',
      poster: 'https://static.wixstatic.com/media/48063d_eabb052b6f944f71a1add22eaa5cf5b0~mv2.png?originWidth=576&originHeight=256',
      rating: '9.0',
      link: 'https://kyool.eu/programs/queen-of-tears'
    },
    {
      id: 3,
      title: 'Lovely Runner',
      category: 'K-Drama Romance',
      poster: 'https://static.wixstatic.com/media/48063d_ea0e1e84a0464b94988bf36ea78b8071~mv2.png?originWidth=576&originHeight=256',
      rating: '8.9',
      link: 'https://kyool.eu/programs/lovely-runner'
    },
    {
      id: 4,
      title: 'Squid Game',
      category: 'K-Drama Thriller',
      poster: 'https://static.wixstatic.com/media/48063d_e987232da5164b4fb640c5c8a4985e0c~mv2.png?originWidth=576&originHeight=256',
      rating: '9.5',
      link: 'https://kyool.eu/programs/squid-game'
    },
    {
      id: 5,
      title: 'Business Proposal',
      category: 'K-Drama Comédie',
      poster: 'https://static.wixstatic.com/media/48063d_cc6e5dff473a42efa7de9516197fc892~mv2.png?originWidth=576&originHeight=256',
      rating: '8.7',
      link: 'https://kyool.eu/programs/business-proposal'
    },
    {
      id: 6,
      title: 'Hometown Cha-Cha-Cha',
      category: 'K-Drama Romance',
      poster: 'https://static.wixstatic.com/media/48063d_a5ea327cbbe043fc89c628b4aac19df8~mv2.png?originWidth=576&originHeight=256',
      rating: '8.8',
      link: 'https://kyool.eu/programs/hometown-cha-cha-cha'
    },
    {
      id: 7,
      title: 'Vincenzo',
      category: 'K-Drama Action',
      poster: 'https://static.wixstatic.com/media/48063d_b864c7fe9689466587863d132d49145d~mv2.png?originWidth=1600&originHeight=896',
      rating: '9.1',
      link: 'https://kyool.eu/programs/vincenzo'
    },
    {
      id: 8,
      title: 'Hospital Playlist',
      category: 'K-Drama Médical',
      poster: 'https://static.wixstatic.com/media/48063d_6b4c5072c5f34b1d843767e66ab8a3f8~mv2.png?originWidth=768&originHeight=576',
      rating: '9.3',
      link: 'https://kyool.eu/programs/hospital-playlist'
    },
    {
      id: 9,
      title: 'Crash Landing on You',
      category: 'K-Drama Romance',
      poster: 'https://static.wixstatic.com/media/48063d_fca29ab7a9c74fb1b18194a1682308b6~mv2.png?originWidth=640&originHeight=384',
      rating: '9.4',
      link: 'https://kyool.eu/programs/crash-landing-on-you'
    },
    {
      id: 10,
      title: 'Goblin',
      category: 'K-Drama Fantasy',
      poster: 'https://static.wixstatic.com/media/48063d_e69f33d9b35f43a9ac1d6494ef4725c3~mv2.png?originWidth=640&originHeight=384',
      rating: '9.0',
      link: 'https://kyool.eu/programs/goblin'
    }
  ];

  // Feature of the Month
  const featureOfTheMonth = {
    title: 'Festival de Hanbok : Tradition Réinventée',
    description: 'Découvrez comment les créateurs coréens modernes transforment le hanbok traditionnel en pièces de mode contemporaine. Une fusion parfaite entre héritage culturel et innovation stylistique.',
    image: 'https://static.wixstatic.com/media/48063d_e987232da5164b4fb640c5c8a4985e0c~mv2.png?originWidth=1200&originHeight=800',
    category: 'Culture & Mode',
    readTime: '8 min',
    featured: true,
    link: '/articles/hanbok-festival-2024'
  };

  // Now on KYOOL video overlay - Dynamic weekly rotation
  const kyoolFeaturedVideos = [
    {
      title: 'Exclusive: Behind the Scenes with NewJeans',
      description: 'Un accès privilégié aux coulisses du dernier clip de NewJeans, avec des interviews exclusives et des moments inédits.',
      thumbnail: 'https://static.wixstatic.com/media/48063d_4dc9ec42ada14b579574177004a5def0~mv2.png?originWidth=1600&originHeight=900',
      duration: '18:42',
      isLive: false,
      category: 'Exclusif KYOOL',
      videoUrl: 'https://static.wixstatic.com/media/48063d_feec986b71d544e2a0522b6711be217b~mv2.png?originWidth=1920&originHeight=1024',
      releaseDate: '2024-01-15'
    },
    {
      title: 'ATEEZ World Tour 2024: Seoul Concert Highlights',
      description: 'Revivez les moments forts du concert d\'ATEEZ à Séoul avec des performances exclusives et des interviews backstage.',
      thumbnail: 'https://static.wixstatic.com/media/48063d_bdf4f3eecac249169b0a244804673eb1~mv2.png?originWidth=1600&originHeight=896',
      duration: '22:15',
      isLive: false,
      category: 'Concert Exclusif',
      videoUrl: 'https://static.wixstatic.com/media/48063d_feec986b71d544e2a0522b6711be217b~mv2.png?originWidth=1920&originHeight=1024',
      releaseDate: '2024-01-08'
    },
    {
      title: 'Queen of Tears: Making-of Documentary',
      description: 'Plongez dans les coulisses du K-Drama phénomène avec Kim Soo-hyun et Kim Ji-won. Découvrez les secrets de tournage.',
      thumbnail: 'https://static.wixstatic.com/media/48063d_1bb5dd4849c8421b811460896f5175ee~mv2.png?originWidth=1600&originHeight=896',
      duration: '28:33',
      isLive: false,
      category: 'Making-of K-Drama',
      videoUrl: 'https://static.wixstatic.com/media/48063d_feec986b71d544e2a0522b6711be217b~mv2.png?originWidth=1920&originHeight=1024',
      releaseDate: '2024-01-01'
    }
  ];

  // Get current featured video (rotates weekly)
  const getCurrentFeaturedVideo = () => {
    const weekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
    return kyoolFeaturedVideos[weekNumber % kyoolFeaturedVideos.length];
  };

  const nowOnKyool = getCurrentFeaturedVideo();

  // Dynamic trending topics - Auto-updated weekly with more variety
  const trendingTopicsPool = [
    // Week 1 Topics
    [
      {
        id: 1,
        title: 'BTS annonce leur comeback 2024',
        category: 'K-Pop',
        trending: '#1',
        image: 'https://static.wixstatic.com/media/48063d_a5ea327cbbe043fc89c628b4aac19df8~mv2.png?originWidth=400&originHeight=300',
        link: '/articles/bts-comeback-2024',
        description: 'Le groupe phénomène prépare son retour avec un album révolutionnaire'
      },
      {
        id: 2,
        title: 'Squid Game saison 2 : premières images',
        category: 'K-Drama',
        trending: '#2',
        image: 'https://static.wixstatic.com/media/48063d_cc2631c4712d4cabbc03c21a04a5e20a~mv2.png?originWidth=400&originHeight=300',
        link: '/articles/squid-game-season-2',
        description: 'Netflix dévoile les premières images de la saison tant attendue'
      },
      {
        id: 3,
        title: 'Festival de Busan 2024 : les highlights',
        category: 'Événements',
        trending: '#3',
        image: 'https://static.wixstatic.com/media/48063d_cc6e5dff473a42efa7de9516197fc892~mv2.png?originWidth=400&originHeight=300',
        link: '/calendar/busan-festival-2024',
        description: 'Les moments forts du plus grand festival de cinéma asiatique'
      },
      {
        id: 4,
        title: 'Recette viral TikTok : Korean Corn Dogs',
        category: 'Cuisine',
        trending: '#4',
        image: 'https://static.wixstatic.com/media/48063d_fca29ab7a9c74fb1b18194a1682308b6~mv2.png?originWidth=400&originHeight=300',
        link: '/articles/korean-corn-dogs-recipe',
        description: 'La street food coréenne qui fait sensation sur les réseaux'
      },
      {
        id: 5,
        title: 'BLACKPINK Lisa : nouveau projet solo',
        category: 'K-Pop',
        trending: '#5',
        image: 'https://static.wixstatic.com/media/48063d_eabb052b6f944f71a1add22eaa5cf5b0~mv2.png?originWidth=400&originHeight=300',
        link: '/articles/lisa-solo-project',
        description: 'L\'artiste thaïlandaise annonce son prochain album solo'
      }
    ],
    // Week 2 Topics
    [
      {
        id: 6,
        title: 'NewJeans bat tous les records avec "Get Up"',
        category: 'K-Pop',
        trending: '#1',
        image: 'https://static.wixstatic.com/media/48063d_4dc9ec42ada14b579574177004a5def0~mv2.png?originWidth=400&originHeight=300',
        link: '/articles/newjeans-get-up-records',
        description: 'Le groupe féminin révolutionne encore une fois l\'industrie'
      },
      {
        id: 7,
        title: 'My Demon : le nouveau hit romantique de SBS',
        category: 'K-Drama',
        trending: '#2',
        image: 'https://static.wixstatic.com/media/48063d_e69f33d9b35f43a9ac1d6494ef4725c3~mv2.png?originWidth=400&originHeight=300',
        link: '/articles/my-demon-sbs-hit',
        description: 'Song Kang et Kim Yoo-jung dans une romance surnaturelle'
      },
      {
        id: 8,
        title: 'Seoul Fashion Week 2024 : K-Beauty trends',
        category: 'Mode & Beauté',
        trending: '#3',
        image: 'https://static.wixstatic.com/media/48063d_6b4c5072c5f34b1d843767e66ab8a3f8~mv2.png?originWidth=400&originHeight=300',
        link: '/articles/seoul-fashion-week-2024',
        description: 'Les nouvelles tendances beauté qui définissent 2024'
      },
      {
        id: 9,
        title: 'Hanbok moderne : tradition réinventée',
        category: 'Culture',
        trending: '#4',
        image: 'https://static.wixstatic.com/media/48063d_e987232da5164b4fb640c5c8a4985e0c~mv2.png?originWidth=400&originHeight=300',
        link: '/articles/hanbok-moderne-2024',
        description: 'Comment les créateurs modernisent le vêtement traditionnel'
      },
      {
        id: 10,
        title: 'ATEEZ World Tour : dates européennes',
        category: 'K-Pop',
        trending: '#5',
        image: 'https://static.wixstatic.com/media/48063d_bdf4f3eecac249169b0a244804673eb1~mv2.png?originWidth=400&originHeight=300',
        link: '/calendar/ateez-world-tour-europe',
        description: 'Le groupe annonce sa tournée européenne tant attendue'
      }
    ],
    // Week 3 Topics
    [
      {
        id: 11,
        title: 'Parasite 2 : Bong Joon-ho confirme la suite',
        category: 'Cinéma',
        trending: '#1',
        image: 'https://static.wixstatic.com/media/48063d_b864c7fe9689466587863d132d49145d~mv2.png?originWidth=400&originHeight=300',
        link: '/articles/parasite-2-confirmed',
        description: 'Le réalisateur oscarisé annonce officiellement la suite'
      },
      {
        id: 12,
        title: 'IVE : nouveau concept pour "I AM"',
        category: 'K-Pop',
        trending: '#2',
        image: 'https://static.wixstatic.com/media/48063d_eabb052b6f944f71a1add22eaa5cf5b0~mv2.png?originWidth=400&originHeight=300',
        link: '/articles/ive-i-am-concept',
        description: 'Le girl group de Starship dévoile son nouveau concept'
      },
      {
        id: 13,
        title: 'Kimchi : patrimoine UNESCO en discussion',
        category: 'Culture',
        trending: '#3',
        image: 'https://static.wixstatic.com/media/48063d_fca29ab7a9c74fb1b18194a1682308b6~mv2.png?originWidth=400&originHeight=300',
        link: '/articles/kimchi-unesco-heritage',
        description: 'La candidature du kimchi au patrimoine mondial avance'
      },
      {
        id: 14,
        title: 'Jeju Island : nouveau spot K-Drama',
        category: 'Voyage',
        trending: '#4',
        image: 'https://static.wixstatic.com/media/48063d_cc6e5dff473a42efa7de9516197fc892~mv2.png?originWidth=400&originHeight=300',
        link: '/articles/jeju-island-kdrama-locations',
        description: 'L\'île devient le décor privilégié des productions coréennes'
      },
      {
        id: 15,
        title: 'Stray Kids : collaboration internationale',
        category: 'K-Pop',
        trending: '#5',
        image: 'https://static.wixstatic.com/media/48063d_a5ea327cbbe043fc89c628b4aac19df8~mv2.png?originWidth=400&originHeight=300',
        link: '/articles/stray-kids-international-collab',
        description: 'Le groupe JYP annonce une collaboration surprise'
      }
    ]
  ];

  // Get current week's trending topics
  const getCurrentTrendingTopics = () => {
    const weekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
    return trendingTopicsPool[weekNumber % trendingTopicsPool.length];
  };

  const trendingTopics = getCurrentTrendingTopics();

  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  const [currentVideoPlaying, setCurrentVideoPlaying] = useState(nowOnKyool);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Auto-rotate trending topics
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrendingIndex((prev) => (prev + 1) % trendingTopics.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [trendingTopics.length]);

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Merci pour votre inscription à la newsletter Kyool !');
    setEmail('');
  };

  const [heroRef, isHeroVisible] = useAnimateOnScroll({ threshold: 0.3, triggerOnce: true });

  return (
    <div className="bg-background text-foreground font-paragraph overflow-clip">
      <style>{`
        .neon-gradient-text {
          color: #24C7EB;
        }
        .neon-border-card {
          position: relative;
          background-color: hsl(0 0% 100% / 0.05);
          border: 1px solid hsl(0 0% 100% / 0.1);
          transition: background-color 0.3s, border-color 0.3s;
        }
        .neon-border-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: #24C7EB;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .neon-border-card:hover::before {
          opacity: 1;
        }
        .neon-border-card:hover {
          background-color: hsl(0 0% 100% / 0.07);
          border-color: hsl(0 0% 100% / 0.2);
        }
        .scroll-fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.215, 0.610, 0.355, 1), transform 0.8s cubic-bezier(0.215, 0.610, 0.355, 1);
        }
        .scroll-fade-in.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-content-item {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .hero-content-item.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      {/* Hero Section */}
      <section ref={heroRef as React.RefObject<HTMLElement>} className="relative h-[100vh] min-h-[700px] w-full overflow-clip flex flex-col">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://static.wixstatic.com/media/48063d_eba98b5b26114818b33416e1fffa0c04~mv2.jpg" 
            alt="Waterfront scene at sunset" 
            width={1920}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        </div>
        <div className="relative z-10 flex-grow flex flex-col justify-end p-6 sm:p-8">
          <div className="max-w-[120rem] mx-auto w-full">
            <div className="max-w-4xl">
              <h1 className={`hero-content-item ${isHeroVisible ? 'is-visible' : ''} font-heading text-5xl sm:text-7xl md:text-8xl font-black uppercase z-20 relative`}>
                <span className="block text-white">Kyool News</span>
                <span className="text-primary block">Votre regard</span>
                <span className="text-primary block">sur la Corée</span>
              </h1>
              <p className={`hero-content-item ${isHeroVisible ? 'is-visible' : ''} mt-6 text-lg md:text-xl text-foreground/80 max-w-2xl`} style={{ transitionDelay: '0.2s' }}>
                Plongez au cœur de la Hallyu. Explorez le meilleur des K-Dramas, de la K-Pop, de la cuisine et des tendances qui façonnent la culture coréenne moderne.
              </p>
              <div className={`hero-content-item ${isHeroVisible ? 'is-visible' : ''} mt-10 flex flex-wrap gap-4`} style={{ transitionDelay: '0.4s' }}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-base font-bold" asChild>
                  <Link to="/articles">
                    Explorer les articles <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 hover:text-white rounded-full px-8 py-6 text-base font-bold" asChild>
                  <Link to="/videos">
                    Voir Kyool TV <Play className="ml-2 h-5 w-5 fill-current" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Categories Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-8">
        <div className="max-w-[120rem] mx-auto">
          <SectionHeader number="01" title="Rubriques Principales" subtitle="Plongez dans l'univers fascinant de la culture coréenne à travers nos contenus exclusifs." className="mb-16" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...featuredCategories].slice(0, 1).map((category) => {
              const [ref, isVisible] = useAnimateOnScroll({ threshold: 0.2, triggerOnce: true });
              return (
                <Link to={category.link} key={category.title} ref={ref as React.RefObject<HTMLAnchorElement>} className={`scroll-fade-in ${isVisible ? 'is-visible' : ''} group block neon-border-card rounded-2xl`}>
                  <Card className="bg-transparent border-none h-full flex flex-col overflow-clip rounded-2xl">
                    <div className="relative w-full aspect-[4/3] overflow-clip">
                      <Image src={category.image} alt={category.title} width={800} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                    <CardContent className="p-8 flex-grow flex flex-col justify-end">
                      <span className="block font-heading text-sm uppercase tracking-widest text-primary">Catégorie</span>
                      <h3 className="mt-2 text-3xl font-bold font-heading text-white">{category.title}</h3>
                      <p className="mt-2 text-foreground/70">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...featuredCategories].slice(1).map((category, index) => {
                const [ref, isVisible] = useAnimateOnScroll({ threshold: 0.2, triggerOnce: true });
                return (
                  <Link to={category.link} key={category.title} ref={ref as React.RefObject<HTMLAnchorElement>} className={`scroll-fade-in ${isVisible ? 'is-visible' : ''} group block neon-border-card rounded-2xl`} style={{ transitionDelay: `${(index + 1) * 100}ms` }}>
                    <Card className="bg-transparent border-none h-full flex flex-col overflow-clip rounded-2xl">
                      <div className="relative w-full aspect-[16/9] overflow-clip">
                        <Image src={category.image} alt={category.title} width={500} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      </div>
                      <CardContent className="p-6 flex-grow flex flex-col justify-end">
                        <h3 className="text-xl font-bold font-heading text-white">{category.title}</h3>
                        <p className="mt-1 text-sm text-foreground/70">{category.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      {/* Feature of the Month Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 bg-white/[.03]">
        <div className="max-w-[120rem] mx-auto">
          <SectionHeader number="02" title="Sélection du Mois" subtitle="Notre coup de cœur éditorial, une découverte exceptionnelle à ne pas manquer." className="mb-16" />
          
          {(() => {
            const [ref, isVisible] = useAnimateOnScroll({ threshold: 0.2, triggerOnce: true });
            return (
              <div ref={ref as React.RefObject<HTMLDivElement>} className={`scroll-fade-in ${isVisible ? 'is-visible' : ''} relative`}>
                <div className="absolute -inset-x-1/4 -top-1/4 -bottom-1/4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl opacity-40 rounded-full"></div>
                <div className="relative neon-border-card rounded-2xl overflow-hidden">
                  <Card className="bg-transparent border-none">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                        <Image 
                          src={featureOfTheMonth.image} 
                          alt={featureOfTheMonth.title} 
                          width={800} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-6 left-6">
                          <Badge className="bg-primary text-primary-foreground flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Sélection du Mois
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                        <Badge variant="outline" className="w-fit mb-4 border-primary/30 text-primary">
                          {featureOfTheMonth.category}
                        </Badge>
                        <h3 className="text-3xl lg:text-4xl font-bold font-heading text-white mb-6">
                          {featureOfTheMonth.title}
                        </h3>
                        <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                          {featureOfTheMonth.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-foreground/60 mb-8">
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {featureOfTheMonth.readTime}
                          </span>
                          <span className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Article exclusif
                          </span>
                        </div>
                        <Button size="lg" className="w-fit bg-primary hover:bg-primary/90" asChild>
                          <Link to={featureOfTheMonth.link}>
                            Lire l'article <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })()}
        </div>
      </section>
      {/* Trending Topics Carousel */}
      <section className="py-16 px-6 sm:px-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
        <div className="max-w-[120rem] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
                Tendances Hallyu
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentTrendingIndex((prev) => (prev - 1 + trendingTopics.length) % trendingTopics.length)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentTrendingIndex((prev) => (prev + 1) % trendingTopics.length)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentTrendingIndex * 100}%)` }}
            >
              {trendingTopics.map((topic) => (
                <div key={topic.id} className="w-full flex-shrink-0">
                  <Link to={topic.link} className="block group">
                    <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                        <div className="relative aspect-video md:aspect-[4/3] overflow-hidden rounded-lg">
                          <Image 
                            src={topic.image} 
                            alt={topic.title} 
                            width={400} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                        <div className="md:col-span-2 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-4">
                            <Badge className="bg-red-500 text-white font-bold">
                              {topic.trending}
                            </Badge>
                            <Badge variant="outline" className="border-primary/30 text-primary">
                              {topic.category}
                            </Badge>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold font-heading text-white mb-4 group-hover:text-primary transition-colors">
                            {topic.title}
                          </h3>
                          <div className="flex items-center gap-2 text-foreground/60">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm">Sujet tendance en ce moment</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          {/* Trending indicators with auto-update info */}
          <div className="flex flex-col items-center gap-4 mt-6">
            <div className="flex justify-center gap-2">
              {trendingTopics.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTrendingIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTrendingIndex 
                      ? 'bg-primary scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Tendances mises à jour automatiquement chaque semaine</span>
            </div>
          </div>
        </div>
      </section>
      {/* Latest Articles Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 bg-white/[.03]">
        <div className="max-w-[120rem] mx-auto">
          <SectionHeader number="03" title="Derniers Articles" subtitle="Restez informé des dernières actualités et analyses de la scène coréenne." className="mb-16" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {[...latestArticles].slice(0, 1).map((article) => {
              const [ref, isVisible] = useAnimateOnScroll({ threshold: 0.2, triggerOnce: true });
              return (
                <div key={article.id} ref={ref as React.RefObject<HTMLDivElement>} className={`scroll-fade-in ${isVisible ? 'is-visible' : ''} lg:col-span-7 group neon-border-card rounded-2xl overflow-clip`}>
                  <Card className="bg-transparent border-none h-full flex flex-col md:flex-row lg:flex-col">
                    <div className="md:w-2/5 lg:w-full relative aspect-video md:aspect-auto lg:aspect-video overflow-clip">
                      <Image src={article.image} alt={article.title} width={700} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <CardContent className="p-8 flex-grow flex flex-col md:w-3/5 lg:w-full">
                      <span className="font-heading text-sm uppercase tracking-widest text-primary">{article.category}</span>
                      <h3 className="mt-2 text-2xl lg:text-3xl font-bold font-heading text-white group-hover:text-primary transition-colors duration-300">{article.title}</h3>
                      <p className="mt-4 text-base text-foreground/70 flex-grow line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-foreground/60 mt-6 border-t border-white/10 pt-4">
                        <span className="flex items-center gap-2"><User className="h-4 w-4" />{article.author}</span>
                        <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
            <div className="lg:col-span-5 flex flex-col gap-8">
              {[...latestArticles].slice(1).map((article, index) => {
                const [ref, isVisible] = useAnimateOnScroll({ threshold: 0.2, triggerOnce: true });
                return (
                  <div key={article.id} ref={ref as React.RefObject<HTMLDivElement>} className={`scroll-fade-in ${isVisible ? 'is-visible' : ''} group neon-border-card rounded-2xl overflow-clip`} style={{ transitionDelay: `${(index + 1) * 100}ms` }}>
                    <Card className="bg-transparent border-none h-full">
                      <CardContent className="p-6">
                        <span className="font-heading text-xs uppercase tracking-widest text-primary">{article.category}</span>
                        <h3 className="mt-2 text-lg font-bold font-heading text-white group-hover:text-primary transition-colors duration-300">{article.title}</h3>
                        <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center gap-2 text-xs text-foreground/60 mt-4 border-t border-white/10 pt-3">
                          <span className="flex items-center gap-1.5"><User className="h-3 w-3" />{article.author}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      {/* Kyool TV Top 10 Programs Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-8">
        <div className="max-w-[120rem] mx-auto">
          <SectionHeader number="04" title="Kyool TV" subtitle="Top 10 des programmes de la semaine - Découvrez les contenus les plus populaires." className="mb-16 text-center" />
          <div className="relative">
            <div className="absolute -inset-x-1/2 -top-1/4 -bottom-1/4 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-3xl opacity-30 rounded-full"></div>
            <div className="relative">
                {(() => {
                    const [ref, isVisible] = useAnimateOnScroll({ threshold: 0.2, triggerOnce: true });
                    return (
                        <div ref={ref as React.RefObject<HTMLDivElement>} className={`scroll-fade-in ${isVisible ? 'is-visible' : ''}`}>
                            <div className="grid grid-cols-5 gap-4 md:gap-6">
                                {top10KyoolPrograms.map((program, index) => (
                                    <a
                                        key={program.id}
                                        href={program.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative aspect-[3/4] neon-border-card rounded-xl overflow-hidden hover:scale-105 transition-all duration-300"
                                        style={{ transitionDelay: `${index * 50}ms` }}
                                    >
                                        <Image 
                                            src={program.poster} 
                                            alt={program.title} 
                                            width={300} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        {/* Ranking Number */}
                                        <div className="absolute bottom-2 left-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        
                                        {/* Rating Badge */}
                                        <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-md text-xs font-bold backdrop-blur-sm">
                                            ★ {program.rating}
                                        </div>
                                        
                                        {/* Hover Content */}
                                        <div className="absolute inset-0 p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <h4 className="text-white font-heading font-bold text-sm mb-1 line-clamp-2">
                                                {program.title}
                                            </h4>
                                            <p className="text-white/80 text-xs line-clamp-1">
                                                {program.category}
                                            </p>
                                            <div className="mt-2 flex items-center gap-1">
                                                <Play className="h-3 w-3 text-primary fill-current" />
                                                <span className="text-primary text-xs font-medium">Regarder</span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                            
                            {/* Additional Info */}
                            <div className="mt-8 text-center">
                                <p className="text-foreground/60 text-sm mb-4">
                                    Classement mis à jour chaque semaine • Cliquez pour regarder sur Kyool TV
                                </p>
                                <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10" asChild>
                                    <a href="https://kyool.eu" target="_blank" rel="noopener noreferrer">
                                        <Tv className="h-4 w-4 mr-2" />
                                        Voir tous les programmes
                                    </a>
                                </Button>
                            </div>
                        </div>
                    );
                })()}
            </div>
          </div>
        </div>
      </section>
      {/* The Pulse of Korea Section */}
      <section className="py-32 sm:py-48 px-6 sm:px-8 overflow-clip">
        <div className="max-w-[120rem] mx-auto text-center">
          <SectionHeader number="05" title="Le Pouls de la Corée" subtitle="Les sujets qui animent la communauté et définissent les tendances actuelles." className="mb-16" />
          <div className="relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-20 [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 font-heading font-bold text-foreground/40">
                <span className="text-5xl md:text-7xl text-white">K-POP</span>
                <span className="text-2xl md:text-4xl">WEBTOONS</span>
                <span className="text-4xl md:text-6xl text-white/80">SEOUL</span>
                <span className="text-xl md:text-3xl text-primary">HALLYU</span>
                <span className="text-5xl md:text-7xl text-white/90">K-DRAMA</span>
                <span className="text-3xl md:text-5xl">K-FOOD</span>
                <span className="text-2xl md:text-4xl text-white/70">BUSAN</span>
                <span className="text-4xl md:text-6xl text-primary">FASHION</span>
            </div>
          </div>
        </div>
      </section>
      {/* Newsletter Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 bg-white/[.03]">
        <div className="max-w-[120rem] mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <SectionHeader number="06" title="Rejoignez la Communauté" subtitle="Recevez les dernières actualités de la culture coréenne directement dans votre boîte mail." className="mb-12" />
            {(() => {
              const [ref, isVisible] = useAnimateOnScroll({ threshold: 0.5, triggerOnce: true });
              return (
                <form ref={ref as React.RefObject<HTMLFormElement>} onSubmit={handleNewsletterSubmit} className={`scroll-fade-in ${isVisible ? 'is-visible' : ''} w-full max-w-lg mx-auto flex flex-col sm:flex-row gap-4`}>
                  <div className="relative flex-grow">
                    <Input
                      type="email"
                      placeholder="Votre adresse email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-14 pl-6 pr-6 rounded-full bg-white/5 border-2 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-white placeholder:text-white/60"
                    />
                  </div>
                  <Button type="submit" size="lg" className="h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base px-8 transition-all duration-300">
                    S'abonner
                  </Button>
                </form>
              );
            })()}
          </div>
        </div>
      </section>
      {/* Welcome Popup */}
      <WelcomePopup
        isOpen={welcomePopup.isOpen}
        onClose={welcomePopup.onClose}
        onSignUp={welcomePopup.onSignUp}
      />
      
      {/* Secure Access Popup */}
      <SecureAccessPopup
        isOpen={showSecureAccess}
        onClose={handleSecureAccessClose}
        onValidated={handleSecureAccessValidated}
      />
    </div>
  );
}
