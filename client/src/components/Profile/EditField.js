import React from "react";

export default function EditField(props) {
    return (
        <div className="field-div">
            <h3 className="field-header">{props.header}</h3>
            <input
                className={props.class}
                onChange={this.onTextChange}
                type="text"
                name="email"
                value={this.state.email}
            />
        </div>
    )
}