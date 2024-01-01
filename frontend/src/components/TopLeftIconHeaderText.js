import { Box, Typography } from "@mui/material"


const TopLeftIconHeaderText = ({ icon: IconComponent, title, text }) => {
    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <IconComponent color='primary' sx={{ width: '45px', height: '45px', marginRight: '30px' }}/>
                <Box sx={{display:'flex', flexDirection:'column', width: '80%'}}>
                    <Typography variant='h6'><strong>{title}</strong></Typography>
                    <br></br>
                    <Typography variant='p' sx={{fontSize: '13px', color: '#999'}}><strong>{text}</strong></Typography>
                </Box>
            </Box>
        </>
    )
}

export default TopLeftIconHeaderText