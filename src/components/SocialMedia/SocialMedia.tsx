import { useState, useEffect } from 'react';
import { FaInstagram, FaTwitter, FaYoutube, FaTiktok, FaFacebook, FaSpotify } from 'react-icons/fa';
import { BREAKPOINTS } from '../../constants/responsive';

const SOCIAL_LINKS = [
  { name: 'Instagram', icon: FaInstagram, url: 'https://www.instagram.com/jul' },
  { name: 'Twitter', icon: FaTwitter, url: 'https://twitter.com/jul' },
  { name: 'YouTube', icon: FaYoutube, url: 'https://www.youtube.com/@jul' },
  { name: 'TikTok', icon: FaTiktok, url: 'https://www.tiktok.com/@jul' },
  { name: 'Facebook', icon: FaFacebook, url: 'https://www.facebook.com/jul' },
  { name: 'Spotify', icon: FaSpotify, url: 'https://open.spotify.com/artist/jul' },
] as const;

const SocialMedia = () => {
  const [iconSize, setIconSize] = useState(24);

  useEffect(() => {
    const updateIconSize = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.mobile) {
        setIconSize(20);
      } else if (width < BREAKPOINTS.tablet) {
        setIconSize(22);
      } else {
        setIconSize(24);
      }
    };

    updateIconSize();
    window.addEventListener('resize', updateIconSize);
    return () => window.removeEventListener('resize', updateIconSize);
  }, []);

  return (
    <div className="fixed top-auto bottom-4 right-4 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 flex flex-row sm:flex-col gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-white z-30 sm:right-2 md:right-4 lg:right-6 xl:right-8">
      {SOCIAL_LINKS.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 active:scale-95 transition-transform duration-200 p-1 sm:p-0"
            aria-label={social.name}
          >
            <Icon size={iconSize} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialMedia;
