import { useCallback, useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import Comment from './Comment'


function CustomNode({ data, onNodeSelect }) {

    const [comments, setComments] =  useState('');
    const {label, id} = data;

    const [color, setColor] = useState('#ffffff');
    const [hide, setHide] = useState(false);

    const onSaveComments = useCallback((val)=>{
        
        setComments(val);
    },)

    const onHide = useCallback(()=>{

    }, []);
    const onColor = useCallback(()=>{

    }, []);


    const onSelect = useCallback((event)=>{
         // 
         const id = event.target.id.substring(5);
        //  onNodeSelect(event.target.id);
    }, []);

    
    return (
        <>
            <div id = {`node-${id}`} style={{position:'relative', width:'240px' ,height:'120px', border:'3px solid black', borderRadius:'5px', background:'#fff', display:'flex', flexDirection:'column'}}>
            <Handle type="target" position={Position.Top} id="a"/>

                {/* Comment Button */}
                <div  style={{position:'absolute', left:'0', top:'0',}}>
                <Comment 
                    commentValue = {comments}
                    type = {comments.length === 0? 'edit':"show"}
                    onSaveComment = {onSaveComments}
                />
                    <div  style={{marginTop:'12px', textAlign:'center', width:'240px', 
                    fontWeight: 400, fontSize: '24px',
                    letterSpacing: '0.5px',
                    lineHeight: '30px',
                    textTransform: 'capitalize',}}>
                        {label}
                    </div>
                </div>
            <Handle type="source" position={Position.Bottom} id="b" />
            </div>
        </>
    );
}

export default CustomNode;