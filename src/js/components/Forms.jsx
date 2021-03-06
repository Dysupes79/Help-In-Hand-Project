var React = require('react');
var $ = require('jquery');
var Link = require('react-router').Link;

var ReactCheckboxGroup = require('react-checkbox-group');
var CheckboxGroup = ReactCheckboxGroup.CheckboxGroup;
var Checkbox = ReactCheckboxGroup.Checkbox;

var withRouter = require('react-router').withRouter;
var fr = require('../../firebase/firebase.js');

// a variable illnesses that contain all illnesses, as well as all symptoms of each illness
var illnesses = {
    Depression: {
        id: 'major depressive disorder',
        name: 'Major Depressive Disorder',
        symptoms: [
          'feel hopeless and helpless',
          'lost interest in friends, activities, etc. that you used to enjoy',
          'feel tired all the time','sleep and appetite have changed',
          'can\'t concentrate or previously easy tasks are now difficult',
          'can\'t control your negative thoughts, no matter how much you try',
          'much more irritable, short-tempered, or aggressive than usual',
          'consuming more alcohol than normal or engaging in other reckless behaviour'
        ]
    },
    Bipolar: {
        id: 'bipolar disorder',
        name: 'Bipolar Disorder',
        symptoms: [
          'feelings of depression',
          'extreme optimism',
          'euphoria',
          'feelings of grandeur',
          'rapid, racing thoughts',
          'hyperactivity',
          'decreased sleep',
          'increased irritability',
          'impulsiveness',
          'possibly reckless behaviour',
          'have a hard time going about your daily routine'
        ]
    },
    Anxiety: {
        id: 'social anxiety disorder',
        name: 'Social Anxiety Disorder',
        symptoms: [
          'fear of situations where you may be judged',
          'worrying about embarrassing or humiliating yourself',
          'concerned about offending someone',
          'intense fear of interacting with or talking to strangers',
          'fear that others will notice you look anxious',
          'fear of embarrassing physical symptoms, such as blushing, sweating, trembling, or having a shaky voice',
          'avoiding doing things or speaking to people out of fear of embarrassment',
          'avoiding situations where you might be the center of attention',
          'having anxiety in anticipation of a feared activity or event',
          'spending time after a social situation analyzing your performance and identifying flaws in your interactions',
          'expecting the worst possible consequences from a negative experience during a social situation',
          'avoiding normal social situations (ex. public restroom, dating, making eye contact, etc.)',
          'fast heartbeat',
          'upset stomach or nausea',
          'trouble catching your breath',
          'dizziness or lightheadedness',
          'confusion or feeling "out-of-body"',
          'diarrhea',
          'muscle tension'
        ]
    },
    PTSD: {
        id: 'post traumatic stress disorder',
        name: 'Post Traumatic Stress Disorder',
        symptoms: [
          'recurring unwanted memories of the traumatic event',
          'reliving the event as if it is happening again (flashbacks)',
          'upsetting dreams about the event',
          'severe emotional distress or physical reactions to things that remind you of the event',
          'trying to avoid thinking or talking about the event',
          'avoiding places, activities, or people that remind you of the event',
          'negative feelings about yourself or other people',
          'inability to experience positive emotions',
          'feeling emotionally numb',
          'lack of interest in activities you once enjoyed',
          'hopelessness about the future',
          'memory problems, including not remembering important aspects of the event',
          'difficulty maintaining close relationships',
          'irritability, angry outbursts or aggressive behaviour',
          'always being on guard for danger',
          'overwhelming guilt or shame',
          'self-destructive behaviour, such as drinking too much or driving too fast',
          'trouble concentrating',
          'trouble sleeping',
          'being easily startled or frightened'
        ],
    },
    OCD: {
        id: 'obsessive compulsive disorder',
        name: 'Obsessive Compulsive Disorder',
        symptoms: [
          'fear of being contaminated by shaking hands or touching objects others have touched (ex. washing hands till raw)',
          'doubts that you\'ve locked the door and turned off the stove despite repeated checking',
          'intense stress when objects aren\'t orderly or facing a certain way',
          'imagining images of hurting yourself or someone else',
          'avoiding situations that can trigger obsessions, such as shaking hands',
          'distress about unpleasant sexual images repeating in your mind',
          'counting in certain patterns',
          'silently repeating a prayer, word, or phrase',
          'arranging things to face the same way'
        ]
    },
};

// making an array of illnessesList containing each object of illness from variable illnesses
var illnessesList = [illnesses.depression, illnesses.bipolar, illnesses.anxiety, illnesses.ptsd, illnesses.ocd];

var Forms = React.createClass({
    getInitialState: function() {
        return {
            selectedIllnesses: [],
            selectedSymptoms: {}
        };
    },
    // takes care of all user inputs that are text, such as name, nationality, etc. only setState when clicked on submit.
    _handleText: function(e) {
        e.preventDefault();
        
        // this.refs.userInput.value contains the value that the user entered inside the text box
        // console.log('AGE:', this.refs.userInputAge.value);
        this.setState({
            dateOfBirth: this.refs.userInputBirthDate.value,
            nationality: this.refs.userInputNationality.value,
            career: this.refs.userInputCareer.value,
            userInputDescriptionInOwnWords: this.refs.userInputDescriptionInOwnWords.value
        });
        
        //console.log("STATE", this.state);
        //console.log('comes here')
    },
    // takes care of all user input that are radio button, such as gender, sexual orientation, and income
    _handleChangeRadio: function(e) {
        this.setState({
            // [e.target.name] is gender, and e.target.value is male, for example
            [e.target.name]: e.target.value
        });
    },
    // next two functions take care of user input checkboxes for illnesses and symptoms of each illness
    // newValue is an array of objects. Each object is an illness that contains its id and its symptoms
    // newValue only contains the objects of illnesses that was checked!
    _handleIllness: function(newValue) {
        // console.log("newValue:", newValue)
        var that = this;
        var newSelectedSymptoms = {};
        
        newValue.forEach(function(illness) {
            // using 'that' rather than 'this' since it is in a new function, and we can't access the properties of 'this' inside.
            // illness.id contains the name of the illness, so we are storing an object with key being illnessName and value being all the checked symptoms respective to their illness
            // for example, depression: [depressionSymptom2, depressionSymptom5]
            newSelectedSymptoms[illness.id] = that.state.selectedSymptoms[illness.id];
        });
        
        // At this point, newSelectedSymptoms object will contain illness objects which each containing their respective checked symptoms
        // console.log("newSelectedSymptoms:", newSelectedSymptoms);
        
        this.setState({
            selectedIllnesses: newValue, 
            selectedSymptoms: newSelectedSymptoms
            
        })
    },
    // illnessId contains the name of the checked illnesses
    _handleSymptoms: function(illnessId) {
        // console.log("illnessId:", illnessId);
        
        var that = this;
        return function(newSymptoms) {
            // newSymptoms is an array of symptoms. It is a different array for different illnesses.
            // console.log("newSymptoms", newSymptoms)
            //console.log("HI", that.state.selectedSymptoms)
            
            // for next ~6 lines, we store all the selectedSymptoms object in that.state inside a new variable selectedSymptoms.
            // we then only update the object inside selectedSymptoms that has the name as the illnessId, giving the value of array of checked newSymptoms.
            // finally, we setState the whole selectedSymptoms object which only the object with specific illnessId was modified.
            var selectedSymptoms = that.state.selectedSymptoms;
            selectedSymptoms[illnessId] = newSymptoms;
            
            that.setState({
                selectedSymptoms: selectedSymptoms
            });
        }
    },
    _handleDatabaseStorage: function() {
        var userFormInfo = this.state;
        //console.log("userFormInto", userFormInfo);
        
        
        var currentUser = fr.firebase.auth().currentUser;
        var uniqueUserId = fr.firebase.auth().currentUser.uid;
        var userEmail = fr.firebase.auth().currentUser.email;
        //console.log("currentUser", currentUser);
        //console.log("currentUser UID", uniqueUserId);
        
        fr.firebase.database().ref('users/' + uniqueUserId).set({
            'Date of Birth': userFormInfo.dateOfBirth, 
            Gender: userFormInfo.gender,
            'Sexual Orientation': userFormInfo.sexual_orientation,
            Nationality: userFormInfo.nationality,
            Career: userFormInfo.career,
            Income: userFormInfo.income,
            'Illnesses & Symptoms': userFormInfo.selectedSymptoms,
            'Description in your own words': userFormInfo.userInputDescriptionInOwnWords
        });
        
        alert('You have successfully completed the form!');
        this.props.router.push('/');
        
    },
    render: function() {
        //console.log("PRINT ALL STATE:", this.state);
        
        if (this.state.dateOfBirth && this.state.nationality && this.state.career && this.state.gender) {
            this._handleDatabaseStorage();
        }
        
        var that = this;
        // from here on, every time there is a props called key is to avoid the error of the necessity of unique key
        
        // this part is for Main Symptoms section
        var symptoms = this.state.selectedIllnesses.map(function(illness) {
            return (
                <CheckboxGroup value={that.state.selectedSymptoms[illness.id]} onChange={that._handleSymptoms(illness.id)} key={illness.id}>
                {
                    illness.symptoms.map(function(symptom) {
                        return <div key={symptom}><label><Checkbox value={symptom}/> {symptom}</label></div>;
                    })
                }
                </CheckboxGroup>
            )
        });
        
        return (
            <div className="questionnaire_forms">
            
                <form onSubmit={this._handleText}>
                
                    <h3> Complete this form (All * must be filled)</h3>
                
                    *Date of Birth: <input type="text" ref="userInputBirthDate" /> dd/mm/yyyy <br/><br/>
                    
                    *Gender: <br/>
                    <input type="radio" onChange={this._handleChangeRadio} name="gender" value="male" /> Male
                    <input type="radio" onChange={this._handleChangeRadio} name="gender" value="female" /> Female <br/><br/>

                    *Nationality: <br/>
                    <input type="text" ref="userInputNationality" />  <br/><br/>
                    
                    *Career: <br/>
                    <input type="text" ref="userInputCareer" />  <br/><br/>
                    
                    Sexual orientation: <br/>
                    <input type="radio" onChange={this._handleChangeRadio} name="sexual_orientation" value="heterosexual" /> Heterosexual <br/>
                    <input type="radio" onChange={this._handleChangeRadio} name="sexual_orientation" value="gay" /> Gay <br/>
                    <input type="radio" onChange={this._handleChangeRadio} name="sexual_orientation" value="lesbian" /> Lesbian <br/> 
                    <input type="radio" onChange={this._handleChangeRadio} name="sexual_orientation" value="bisexual" /> Bisexual <br/> 
                    <input type="radio" onChange={this._handleChangeRadio} name="sexual_orientation" value="transgender" /> Transgender <br/> 
                    <input type="radio" onChange={this._handleChangeRadio} name="sexual_orientation" value="other" /> Other <br/><br/> 
                    
                    Income: <br/>
                    <input type="radio" onChange={this._handleChangeRadio} name="income" value="0-20,000" /> $0-$20,000 <br/>
                    <input type="radio" onChange={this._handleChangeRadio} name="income" value="20,000-40,000" /> $20,000-$40,000 <br/>
                    <input type="radio" onChange={this._handleChangeRadio} name="income" value="40,000-60,000" /> $40,000-$60,000 <br/>
                    <input type="radio" onChange={this._handleChangeRadio} name="income" value="60,000-80,000" /> $60,000-$80,000 <br/>
                    <input type="radio" onChange={this._handleChangeRadio} name="income" value="80,000-100,000" /> $80,000-$100,000 <br/>
                    <input type="radio" onChange={this._handleChangeRadio} name="income" value="100,000+" /> $100,000+ <br/><br/>
                    
                    Major Illness: (Select all that apply) <br/>
                    <CheckboxGroup value={this.state.selectedIllnesses} onChange={this._handleIllness} name="major_illnesses">
                        {
                            Object.keys(illnesses).map(function(illness) {
                                return <div key={illness}><label><Checkbox value={illnesses[illness]}/> {illness}</label></div>;
                            })
                        }
                    </CheckboxGroup>
                    
                    <br/>
                    Main Symptoms: (Select all that apply) <br/><br/>
                    {symptoms}
                    
                    <br/><br/>
                    Description in your own words: <br/>
                    <input className="descrip_own_words" type="text" ref="userInputDescriptionInOwnWords" />  <br/><br/>

                    <button className="submit_form"> Submit! </button>
                </form>
                
            </div>
        
        );
    }
  
});


var FormsWithRouter = withRouter(Forms);

module.exports = FormsWithRouter;