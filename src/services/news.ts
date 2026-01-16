// F1 News Service - Fetches news from official F1 RSS feed
import axios from 'axios';

export interface NewsArticle {
    id: string;
    title: string;
    description: string;
    link: string;
    pubDate: string;
    imageUrl?: string;
    category?: string;
}

// Parse RSS XML to extract news items
const parseRSSFeed = (xml: string): NewsArticle[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const items = doc.querySelectorAll('item');

    const articles: NewsArticle[] = [];

    items.forEach((item, index) => {
        const title = item.querySelector('title')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';

        // Extract image from media:content or enclosure
        let imageUrl = '';
        const mediaContent = item.querySelector('content');
        if (mediaContent) {
            imageUrl = mediaContent.getAttribute('url') || '';
        }
        const enclosure = item.querySelector('enclosure');
        if (!imageUrl && enclosure) {
            imageUrl = enclosure.getAttribute('url') || '';
        }

        // Extract category
        const category = item.querySelector('category')?.textContent || '';

        articles.push({
            id: `news-${index}`,
            title: cleanText(title),
            description: cleanText(description),
            link,
            pubDate,
            imageUrl,
            category,
        });
    });

    return articles;
};

// Clean HTML entities and tags from text
const cleanText = (text: string): string => {
    return text
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .trim();
};

// Use a CORS proxy to fetch RSS feeds
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Get latest F1 news
export const getLatestNews = async (limit: number = 10): Promise<NewsArticle[]> => {
    try {
        // Official F1 RSS feed
        const feedUrl = 'https://www.formula1.com/en/latest/all.xml';
        const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(feedUrl)}`, {
            timeout: 10000,
        });

        const articles = parseRSSFeed(response.data);
        return articles.slice(0, limit);
    } catch (error) {
        console.error('Error fetching F1 news:', error);
        // Return fallback mock news if RSS fails
        return getMockNews();
    }
};

// Get technical/development news
export const getTechnicalNews = async (limit: number = 5): Promise<NewsArticle[]> => {
    try {
        // Autosport F1 feed for technical news
        const feedUrl = 'https://www.autosport.com/rss/f1/news/';
        const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(feedUrl)}`, {
            timeout: 10000,
        });

        const articles = parseRSSFeed(response.data);
        return articles.slice(0, limit);
    } catch (error) {
        console.error('Error fetching technical news:', error);
        return [];
    }
};

// Fallback mock news for when RSS fails
const getMockNews = (): NewsArticle[] => {
    return [
        {
            id: 'mock-1',
            title: '2026 F1 Season Preview: New Regulations Set to Shake Up the Grid',
            description: 'The 2026 Formula 1 season brings revolutionary new power unit regulations, with all teams unveiling completely redesigned cars.',
            link: 'https://www.formula1.com',
            pubDate: new Date().toISOString(),
            category: 'Technical',
        },
        {
            id: 'mock-2',
            title: 'Driver Transfers: Hamilton at Ferrari as Antonelli Joins Mercedes',
            description: 'The 2026 grid sees major changes with Lewis Hamilton switching to Ferrari and young Italian Kimi Antonelli taking his seat at Mercedes.',
            link: 'https://www.formula1.com',
            pubDate: new Date().toISOString(),
            category: 'Drivers',
        },
        {
            id: 'mock-3',
            title: 'Pre-Season Testing: What We Learned from Bahrain',
            description: 'Teams completed their first runs with 2026 machinery at the Sakhir circuit ahead of the season opener.',
            link: 'https://www.formula1.com',
            pubDate: new Date().toISOString(),
            category: 'Testing',
        },
        {
            id: 'mock-4',
            title: 'New Power Units: 2026 Regulations Explained',
            description: 'A deep dive into the all-new power unit regulations that are transforming Formula 1 for the 2026 season and beyond.',
            link: 'https://www.formula1.com',
            pubDate: new Date().toISOString(),
            category: 'Technical',
        },
        {
            id: 'mock-5',
            title: 'Calendar Confirmed: 24 Races Set for 2026 Season',
            description: 'FIA confirms the full 2026 race calendar featuring new venues and the return of classic circuits.',
            link: 'https://www.formula1.com',
            pubDate: new Date().toISOString(),
            category: 'Calendar',
        },
    ];
};
