import * as React from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import AddCommentRoundedIcon from '@mui/icons-material/AddCommentRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import IconButton from '@mui/material/IconButton';
import { useState, useCallback } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};


export default function BasicPopover({ type, onSaveComment, commentValue }) {
    const [changingCommentVal, setchangingCommentVal] = useState('')
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleCommentChange = (event) => {
        setchangingCommentVal(event.target.value);
    };
    
    const handleCommentClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const onSaveButtonClick = () => {
        handleClose()
        onSaveComment(changingCommentVal)
    }
    const view = useCallback(
        () => {
            if (type === "edit") {
                return (<div style={{ padding:'12px', display:'flex', flexDirection:'column' }}>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Enter comments"
                        multiline
                        maxRows={4}
                        value={changingCommentVal}
                        onChange={handleCommentChange}
                    />

                    <Button style={{marginTop:'12px'}}variant="outlined" onClick={onSaveButtonClick}>
                        Save
                    </Button>
                </div>
            )}
            else {
                return(<div style={{padding:'20px', maxWidth:'200px', whiteSpace: 'initial'}}>
                    {commentValue}
                </div>)
            }
        },
        [changingCommentVal, type,],
    )
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    
    return (
        <div style={{ border: '1px black' }}>
            <IconButton aria-label="add comment" onClick={handleCommentClick}                        >
                {
                    commentValue.length ?
                        <ChatBubbleRoundedIcon />
                        :
                        <AddCommentRoundedIcon />
                }
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}>
                    {view()}
            </Popover>
        </div>
    );
}
