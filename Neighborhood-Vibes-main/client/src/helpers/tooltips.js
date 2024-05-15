import * as React from 'react';
import { styled } from '@mui/material/styles';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} placement="top-start" />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

export function CustomizedTooltips(desc) {
    return (
        <HtmlTooltip
            title={
                <React.Fragment>
                    <Typography color="inherit">{desc.desc[0]}</Typography>
                    {desc.desc[1]}
                </React.Fragment>
            }
        >
            <IconButton className='tooltips'>
                <HelpOutlineOutlinedIcon style={{ color: 'white', fontSize: 15 }}  />
            </IconButton>
        </HtmlTooltip>
    );
}