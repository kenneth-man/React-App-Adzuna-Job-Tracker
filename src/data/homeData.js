import { ReactComponent as JobIcon } from '../res/icons/suitcase.svg';
import { ReactComponent as FixIcon } from '../res/icons/tools.svg';
import { ReactComponent as MatchIcon } from '../res/icons/sound-mix.svg';

export const homeShowcase = [
    {
        icon: <JobIcon/>,
        title: 'Every job',
        subTitle: 'Searching for the right job is hard work. We’ve brought every job into one place so you can find yours.',
        url: 'https://www.adzuna.co.uk/about-us.html',
        urlText: 'Learn more'
    },
    {
        icon: <FixIcon/>,
        title: 'Smart matches',
        subTitle: 'We’ve spent a decade developing a more transparent search engine so you can zero in on the right role faster.',
        url: 'https://www.adzuna.co.uk/jobs/advanced-search',
        urlText: 'Try advanced search'
    },
    {
        icon: <MatchIcon/>,
        title: 'Great data',
        subTitle: 'Using the best tools is a no brainer. Find local salary and hiring trends so you can get ahead.',
        url: 'https://www.adzuna.co.uk/jobs/salaries',
        urlText: 'See UK stats'
    },
]