import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Sidebar, Segment, Button, Menu, Image, Icon, Header, Checkbox, Form,  Message, Label, Divider } from 'semantic-ui-react'
import Img from 'react-image'
import { Route, Redirect } from 'react-router';
import AdSense from 'react-adsense';

//Component
import HeaderPage from '../component/HeaderPage.js';
import ContentMenuRight from '../component/ContentMenuRight.js';
import ButtonPusher from '../component/ButtonPusher.js';
import ContentMenuLeft from '../component/ContentMenuLeft.js';
import FormPosterReponse from '../component/FormPosterReponse.js';
import SingleMessagePost from '../component/SingleMessagePost.js';
import ListeReponses from '../component/ListeReponses.js';

import { Comments } from '../../api/Reponses.js';
import { Posts } from '../../api/Messages.js';

class SingleMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          visibleForm:false,
        }
    }

    visible(){
      this.setState({
        visibleForm: !this.state.visibleForm,
      });
    }

    componentDidMount() {
        this.scrollToTop();
    }


    scrollToTop() {
        this.el.scrollIntoView();
    }

    toggleVisibility = () => this.setState({ visible: !this.state.visible })
    toggleHidden = () => this.setState({ visible: false })


renderAllreponses() {
      let Allreponses = this.props.allreponses;

      return Allreponses.map((message) => {
       let date = Date.parse(message.submitted);
         
        return (
          <ListeReponses
            key={message._id}
            message={message}
            date={date}         
          />
        );
      });
  }




    render() {
    const { visible } = this.state  
    if (!Meteor.loggingIn() && !Meteor.userId()){
      return <Redirect to="/" />;
    }
    
    return (
      <div className="container">
      <div ref={el => { this.el = el; }} ></div>
        <header>
          <div className="containerSupHeader">
          <ContentMenuLeft />
            <div className="containerHeader">
            <div className="headerPage">
              <HeaderPage />
              <span
               className="buttonPush"
               onClick={this.toggleVisibility}>

               <ButtonPusher />
               </span>
            </div>
            </div>
          </div>
        </header>
       
        <Sidebar.Pushable >
              <Sidebar
                animation='overlay'
                className="ListRight"
                direction='right'
                visible={visible}
                icon='labeled'
                vertical
                className="SidebarUI"
              >
                <ContentMenuRight />
              </Sidebar>
              
              <Sidebar.Pusher>
        
                <div className="containerSite" onClick={this.toggleHidden}>
                  <div className="containerIMG">
                  <div className="MainContent">
                    <div onClick={this.visible.bind(this)}>
                      <SingleMessagePost id={this.props.match.params.id} />
                    </div>
                  <div className={this.state.visibleForm ? "visibleForm" : "none"}>
                     <FormPosterReponse
                      id={this.props.match.params.id}
                      authorId={this.props.authorId}
                      titreMessage={this.props.titreMessage}
                      />
                  </div>
                  <Divider />
                  <div className="pubSondage">
                    <AdSense.Google
                      client='ca-pub-6112176939320267'
                      slot='4929880369'
                      style={{ display: 'inline-block',width:'468px', height:'60px'}}
                    />
                  </div>
                   {this.renderAllreponses()}
                  </div>    
                      
                  </div> 
                </div>

              </Sidebar.Pusher>

        </Sidebar.Pushable>
      
      </div>
    );
  }
}

export default SingleMessage =  withTracker(({ match }) => {
  const reponse = match.params.id;
  const Handle = Meteor.subscribe('reponsesSingleMessage',reponse );
  const loading = !Handle.ready();
  const allreponses = Comments.find({postId:reponse}, { sort: {submitted: -1 } });
  const reponseExists = !loading && !!allreponses;

  const Handle1 = Meteor.subscribe('SingleMessages', reponse);
  const loading1 = !Handle1.ready();
  const authorId = Posts.findOne({_id:reponse});
  const reponseExists1 = !loading1 && !!authorId;

  return {
    allreponses: reponseExists ? allreponses.fetch() : [],
    authorId:reponseExists1 ? authorId.post_author_id : '',
    titreMessage:reponseExists1 ? authorId.post_title : '',

  };
})(SingleMessage);
