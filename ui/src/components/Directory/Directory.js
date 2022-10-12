import * as React from 'react';
import Switch from '@mui/material/Switch';
import { useState } from 'react'
function Directory({ data, onCollapseHandler }) {
    const [checked, setChecked] = useState(true);

    const handleChange = (event) => {
        setChecked(event.target.checked);
        onCollapseHandler(event.target.checked, data.id);
    };
    
    return (
        <div
            style={{ height: '300px', width: '300px' }}
        >
            <Switch
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
            />

        </div>

    );
}

export default Directory;