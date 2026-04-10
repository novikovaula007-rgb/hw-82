import {Box} from "@mui/material";

const CardOverlay = () => {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                zIndex: 1,
                pointerEvents: 'none',
            }}
        />
    );
};

export default CardOverlay;