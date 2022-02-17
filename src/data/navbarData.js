import { ReactComponent as HomeIcon } from '../res/icons/home.svg';
import { ReactComponent as JobsIcon } from '../res/icons/work.svg';
import { ReactComponent as SalariesIcon } from '../res/icons/wallet.svg';
import { ReactComponent as VacanciesIcon } from '../res/icons/emoji_people.svg';
import { ReactComponent as ProfileIcon } from '../res/icons/person.svg';

export const navbarData = [
    {
        icon: <HomeIcon/>,
        text: 'Home',
        route: '/'
    },
    {
        icon: <JobsIcon/>,
        text: 'Jobs',
        route: '/Jobs'
    },
    {
        icon: <SalariesIcon/>,
        text: 'Salaries',
        route: '/Salaries'
    },
    { 
        icon: <VacanciesIcon/>,
        text: 'Vacancies',
        route: '/Vacancies'
    },
    {
        icon: <ProfileIcon/>,
        text: 'Profile',
        route: null
    }
]