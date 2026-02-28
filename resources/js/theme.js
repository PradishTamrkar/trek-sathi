import { createTheme } from "@mui/material";
import { light } from "@mui/material/styles/createPalette";

const theme = createTheme({
    palette:{
        mode:'light',
        primary: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20',
            contrastText: '#fff',
        },
        secondary:{
            main: '#c8973a',
            light: '#f5c06a',
            dark: '#966b1f',
            contrastText: '#fff',
        },
        background:{
            default: '#f5f5f5',
            paper:'#ffffff',
        },
        text:{
            primary: '#1a2e1f',
            secondary: '#5a7060',
        },
        error:{
            main: '#d32f2f',
        },
        divider: 'rgba(0,0,0,0.08)'
    },

    typography:{
        fontFamily: [
            'DM Sans',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'sans-serif',
        ].join(','),
        h1: { fontWeight: 800 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape:{
        borderRadius:10,
    },
    components:{
        MuiTextField:{
            defaultProps:{
                variant:'outlined',
                size:'small',
                fullWidth:true,
            },
        },
        MuiButton:{
            defaultProps:{
                disableElevation: true,
            },
            styleOverrides:{
                root:{
                    borderRadius: 8,
                    padding: '10px 20px',
                },
            },
        },
        MuiCard:{
            styleOverrides:{
                root:{
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
                    borderRadius:14,
                },
            },
        },
        MuiPaper:{
            styleOverrides:{
                root:{
                    backgroundImage: 'none',
                },
            },
        },
        MuiCssBaseline:{
            styleOverrides: `
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
            *{box-sizing: border-box; }
            body {backgoround-color: #f5f5f5; }
            `,
        },
    },
});

export default theme;
