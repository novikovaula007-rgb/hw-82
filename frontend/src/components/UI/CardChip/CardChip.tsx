import {Chip} from "@mui/material";
import * as React from "react";


interface Props {
    text: string,
}

const CardChip: React.FC<Props> = ({text}) => {
    return (
        <Chip
            label={text}
            size="small"
            color="secondary"
            sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 10,
                fontWeight: 'bold',
                boxShadow: 3
            }}
        />
    );
};

export default CardChip;