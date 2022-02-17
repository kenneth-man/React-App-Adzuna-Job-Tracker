import React from 'react';

const Page = ({ children, extraClasses, backgroundImage, backgroundVideo, backgroundExtraClasses }) => {
    return <div 
        className={`Page flex flex-col flex-1 justify-start items-center ${extraClasses}`}
        style={backgroundImage && {backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundImage})`, backgroundRepeat: 'repeat-y'}}
    >
        {
            backgroundVideo &&
            <video 
                src={backgroundVideo} 
                autoPlay 
                muted 
                loop 
                className={`${backgroundExtraClasses} w-full h-full top-0 left-0 object-cover brightness-75 z-0`}
            />
        }
        {children}
    </div>
};

export default Page;