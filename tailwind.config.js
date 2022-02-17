module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Heebo']
            },
            colors: {
                'adzuna': '#279b37'
            },
            width: {
                'input': '450px',
                'result': '400px',
                'result-h1': '350px',
                'home-showcase': '500px'
            },
            height: {
                'home-showcase': '300px',
                'chart': '500px'
            },
            minHeight: {
                'navbar': '80px',
                'form': '300px',
                'result': '400px',
            },
            minWidth: {
                'result': '400px'
            }
        }
    },
    plugins: [],
}
