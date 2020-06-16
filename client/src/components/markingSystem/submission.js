import React, { useState,useEffect } from 'react';
import Nav from '../profile/Nav/Nav';
import UserImg from "../profile/CLIP.png";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import Select from "react-select";

function SubmissionPage(props) {
    const [commentMsg, setCommentMsg] = useState("");
    const [submissions,setSubmissions] = useState([]);
    const [deliverable,setDeliverable] = useState(null);
    const [curIndex,setCurIndex] = useState(0);
    
    
    
    useEffect(()=>{
        props.history.push(`/submission/${props.match.params.id}/${curIndex}`);
    },[curIndex]);
    useEffect(()=>{
        if(!props.location.deliverable){
        // Get the data from the database
        axios.get(`/deliverableFull/${props.match.params.id}`)
            .then(res=>{
            if(res.data.success){
                console.log("data from DataBase");
                const {title,dueDate,points} = res.data.deliverable;
                setSubmissions(res.data.deliverable.submissions);
                setCurIndex(props.match.params.index<res.data.deliverable.submissions.length?Number(props.match.params.index):0);
                setDeliverable({title,dueDate,points});
            }else{
                alert(res.data.msg);
            }
            })
            .catch(err=>{
            alert(err.message);
            })
        }else{  //Data provided during the redirect
        console.log("data from props");
        const {title,dueDate,points} = props.location.deliverable;
        setSubmissions(props.location.deliverable.submissions);
        setCurIndex(Number(props.match.params.index));
        setDeliverable({title,dueDate,points});
        }
    },[])

    const handleSubComment=function(e){
        e.preventDefault();
        alert("comment Submitted");
    }
    const options=[];
    if(deliverable){
        submissions.forEach((s,i)=>{
            options.push({value:String(i),
                label:(<div className="d-flex w-100 justify-content-between"><div className="d-flex align-content-center " style={{fontSize:"20px"}}>
                    <div className="mr-2"><img src={s.userId.profilePic} style={{width:"30px",height:"30px",objectFit:"cover"}} className="rounded-circle" /> </div>  
                    <div>{"    "+s.userId.name?s.userId.name:""}</div> 
                    </div>
                    <div className="mr-2" style={{fontSize:"13px"}}> <b> {s.submissionId?"Handed In":"Pending"} </b>  </div>
                    </div>)})
        })
    }

    return (
        <React.Fragment>
            <Nav show={true} />
            <div className="bgwhiteoverlay" ></div>
            <div className="container text-left" style={{marginTop:"100px"}}>
                <div className="row">
                    <div className="col-12 p-3">
                    <div className=" p-3  shadow" style={{borderRadius:"18px",backgroundColor:"rgb(255, 235, 249)"}}>
                        <h2 className="topicTitle mainH text-left text-pink" style={{display:"flex",justifyContent:"space-between"}}>
                             <div> {deliverable?deliverable.title:""} </div>
                             <div className="p-lg-3 p-2 bg-grad text-white rounded-circle shadow " style={{fontSize:"20px"}}> {deliverable?deliverable.points:""} </div>
                        </h2>
                          <span className="cursor-pointer p-2 pb-4" onClick={()=>props.history.push("/marks")}><i className="fa fa-arrow-left anim-hil text-pink"></i> Go Back</span><br/>
                    </div>
                    </div>
                    {deliverable?
                    <React.Fragment>

                        <div className="col-lg-8 pt-4 align-self-center">
                            <div >
                          
                                <Select
                                    options={options}
                                    value={options[curIndex]}
                                    onChange={(e)=>{setCurIndex(Number(e.value))}}
                                    getOptionLabel={option => option.label}
                                    classNamePrefix="react-select"
                                    className="p-2"
                                    
                                    
                                />
                                {/* <select className="form-control  form-control-lg" style={{height:"60px",fontSize:"26px"}} value={curIndex} onChange={(e)=>setCurIndex(Number(e.target.value))}>
                                    {submissions.map((s,i)=>(
                                        <option value={i} key={i}  > {s.userId.name} </option>
                                    ))}
                                </select> */}
                            </div>
                        </div>
                        <div className="col-lg-4 pt-2 pt-lg-4 text-right text-lg-center align-self-center">
                            {curIndex!=0?<span className="mx-3 h3 cursor-pointer" onClick={()=>{setCurIndex(curIndex-1)}}> <i className="fa fa-less-than text-pink"></i></span> :null}
                            {curIndex!=submissions.length-1?<span className="mx-3 h3 cursor-pointer" onClick={()=>{setCurIndex(curIndex+1)}}> <i className="fa fa-greater-than text-pink"></i></span>:null}
                            
                            
                        </div>
                        <div className="col-lg-8 mt-4">
                            <div className="px-4 row justify-content-between">
                                <div> 
                                    <h3 className="text-pink">Files</h3>
                                    <p style={{fontSize:"12px"}} className="text-gray"><b>Handed in on </b>  {submissions[curIndex].submissionId?submissions[curIndex].submissionId.timestamp:"Not Submitted Yet"}</p>
                                </div>
                                <div className="p-3 ">
                                    <a className="btn btn-outline-grad btn-block" href={submissions[curIndex].submissionId?submissions[curIndex].submissionId.fileURL:""}> {submissions[curIndex].submissionId?"Download File":"No File"}</a>
                                </div>
    
                            </div>
                        </div>
                        <div className="col-lg-4 mt-4 px-4 px-lg-0 text-lg-right">
                            <h3 className="text-pink"> Marks </h3>
                            <hr/>
                            <div className="ml-2">
                                {submissions[curIndex].submissionId?
                                <React.Fragment>
                                    <input  type="number" className="comment-inp text-center" value={submissions[curIndex].submissionId.marks} style={{width:"50px",padding:0,fontSize:"18px"}}></input>
                                <span className="px-2" style={{fontSize:"20px"}} >/ {deliverable?deliverable.points:""}</span>
                                </React.Fragment>
                                :<h4>Not Submitted Yet</h4>
                                }
                                
                            </div>
                        </div>
                        {submissions[curIndex].submissionId?
                        <div className="col-lg-8 my-5 px-4">
                            <div className="p-3" style={{backgroundColor:"#e1e1e1",borderRadius:"18px"}}>
                                <h3>Private Comments</h3>
                                <hr/>
                                
                                <div className="row mt-3" style={{justifyContent:"center"}}>
                                    <div className="profile-pic rounded-circle border " style={{height:"50px",width:"50px",overflow:"hidden"}}><img src={submissions[curIndex].userId.profilePic || UserImg}  className="rounded-circle  responsive-img" /></div>
                                    <div className="col-9">
                                        <h6 className="text-left"><b>{submissions[curIndex].userId.name}</b></h6>
                                        <div className="text-left" style={{lineHeight:"100%"}}>
                                            {submissions[curIndex].submissionId.comment}
                                        </div>
                                    </div>
                                </div>
                                
                                    <form className="my-3" onSubmit={handleSubComment}>
                                        <input type="text" placeholder="Reply to this message" value={commentMsg} onChange={(e)=>{setCommentMsg(e.target.value)}} className="w-100 comment-inp" />
                                    </form>
                                
    
    
                            </div>
    
                        </div>        
                        :<div className="mb-4"></div>}
                    </React.Fragment>
                    :null
                    }
            
                    
                </div>
            </div>
        </React.Fragment>
    )
};


export default SubmissionPage;

