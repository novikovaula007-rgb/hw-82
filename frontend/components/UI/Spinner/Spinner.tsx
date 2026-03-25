import {Box, CircularProgress} from "@mui/material";

const Spinner = () => {
    return (
        <Box>
            <CircularProgress sx={{color: '#171717'}}/>
        </Box>
    );
};

export default Spinner;