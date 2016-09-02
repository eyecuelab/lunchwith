import React from 'react';
import * as userService from '../../services/user-service';
import SkillsForm from '../SkillsForm';
var Router = require('react-router');

var UpdateForm = React.createClass({

	updateInfo: function() {
		
	},

	render: function() {
		return (
	  	<div>
			  <form onSubmit={this.updateInfo}>
					<p className="control">
						<input className="input" placeholder="First Name" />
					</p>
					<p className="control">
						<input className="input" placeholder="Last Name" />
					</p>
					<p className="control">
						<input className="input" placeholder="Company" />
					</p>
					<p className="control">
						<input className="input" placeholder="Title" />
					</p>
					<p className="control">
						<textarea className="textarea" placeholder="Bio"></textarea>
					</p>
					<button type="submit" className="button is-medium is-orange">
						<p>Update</p>
					</button>
				</form>
	    </div>
	  )
	}
});

export default UpdateForm;
