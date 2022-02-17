import React from 'react';
import Page from '../components/Page';
import Column from '../components/Column';
import Row from '../components/Row';
import LinkButtonComponent from '../components/LinkButtonComponent';
import { homeShowcase } from '../data/homeData';
import backgroundVideo from '../res/videos/background-vid-3.mp4';
import { ReactComponent as RightArrowIcon } from '../res/icons/keyboard_arrow_right.svg';
import LinkComponent from '../components/LinkComponent';

const Home = () => {
    return <Page backgroundVideo={backgroundVideo} backgroundExtraClasses='absolute'>
        <Column extraClasses='space-y-32 py-20 z-10'>
            <h1 className='text-white'>Adzuna &ndash; Zero in on the right role!</h1>

            <Row extraClasses='w-full justify-center'>
                {
                    homeShowcase.map((curr, index) => 
                        <Column 
                            key={index} 
                            extraClasses='relative  justify-between w-home-showcase h-home-showcase mx-10 px-4 py-12 bg-slate-300/40'>
                            <div className='absolute -top-10 bg-adzuna fill-white rounded-full p-4'>
                                {curr.icon}
                            </div>
                            <h1 className='text-white'>{curr.title}</h1>
                            <h2 className='text-white'>{curr.subTitle}</h2>
                            <a
                                className='home-showcase-link flex items-center text-emerald-300 fill-emerald-300'
                                href={curr.url}
                                alt={`home-${curr.title}`}
                            >
                                {curr.urlText}
                                <RightArrowIcon/>
                            </a>
                        </Column>
                    )
                }
            </Row>

            <Column extraClasses='space-y-8'>
                <h2 className='text-white'>Get your future started now and browse jobs!</h2>

                <LinkButtonComponent to='/Jobs'>View Jobs</LinkButtonComponent>
            </Column>
        </Column>
    </Page>
};

export default Home;