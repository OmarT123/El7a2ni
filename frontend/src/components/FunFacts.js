import { Box, Typography } from '@mui/material'
import OtherHousesIcon from '@mui/icons-material/OtherHouses';



const FunFact = () => {

    const IconBox = ({ icon: IconComponent, number, text }) => {
        return (
             <div elevation={3} style={{ display: 'flex', alignItems: 'center', padding: 2, width: '150px'}}>
                <IconComponent sx={{ fontSize: 40,  borderRadius: '50%', border: '2px solid #000', padding: '8px' }}/>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '20px', alignItems: 'flex-start' }}>
                    <Typography variant="h6">{number}</Typography>
                    <Typography variant="body2">{text}</Typography>
                </Box>
           </div>
        )
    }

  return (
    <>
         <Box
            sx={{
                width: '100%',
                height: '290px',
                backgroundColor: 'rgba(25, 118, 210, 0.5)',
                backgroundImage: 'url(/fun-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                // opacity: 0.4,
            }}
        >

        {/* <Box
            sx={{
                width: '70%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                alignContent: 'center',
            }}
            >
            <IconBox icon={OtherHousesIcon} number="1" text="First" />
            <IconBox icon={OtherHousesIcon} number="2" text="Second" />
            <IconBox icon={OtherHousesIcon} number="3" text="Third" />
            <IconBox icon={OtherHousesIcon} number="4" text="Fourth" />
        </Box> */}
        </Box>
    </>
  );
};

export default FunFact;
