import React from "react";
import "./section.css";

const Section= (props)=>{
    return (
    <section className="section">
        <h2 className="sectionHead"> {props.heading}</h2>
        {!props.type?(
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat autem rerum molestias aut modi labore, excepturi reiciendis asperiores! Rerum nesciunt quia nostrum porro sequi animi soluta optio quam facilis consectetur?</p>
        ):null}
    </section>
    );
};

export default Section;