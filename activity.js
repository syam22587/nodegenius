import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Activities } from "/imports/api/activities/activities";
import {
  Button,
  Form,
  Header,
  Container,
  Grid,
  GridColumn,
  Card,
  Item,
  Image,
  Icon,
  Checkbox,
  TextArea,
} from "semantic-ui-react";
import { filter, find, get, map } from "lodash";
import { FlowRouter } from "meteor/kadira:flow-router";
import { Roles } from "meteor/alanning:roles";
import GenericMyDivision from "./generic_my_division";
import GenericDivision from "./generic_division";
import OneOnOneMyDivision from "./oneonone_my_division";
import ActivitySubscription from "./activity_subscription";
import { Subscription } from "/imports/api/subscriptions/subscription";
import { Divisions } from "../../../imports/api/divisions";

class Activity extends Component {
  state = {};

  onSelectChangeHandle = (ev) => {
    chosenDivisionTitle = ev;
  };

  onClickHandler = (event) => {
    event.preventDefault();

    let target = event.target;
    let email = target.email.value;

    let userToAddID;

    // Meteor.users.find({}).forEach(user => {
    //   if (user.emails[0].address === email) {
    //     userToAddID = user._id;
    //   }
    // });

    // if (!userToAddID) {
    //   userToAddID = email;
    // }
    let chosenDivisionTitle = "Just for fun";
    Meteor.call(
      "addUserToDivision",
      {
        email,
        activityId: this.props.activity._id,
        chosenDivisionTitle,
        userToAddID: email,
      },
      (err) => {
        if (err) {
          sAlert.error(err.message);
        } else {
          target.email.value = "";
          sAlert.success("Added to club list.");
        }
      }
    );
  };

  messagesForDivision = (divisionId) =>
    filter(divisionMessages, (dm) => dm.divisionId === divisionId);
  sendersForDivision = (divisionId) =>
    filter(senders, (sender) =>
      find(
        messagesForDivision(divisionId),
        (dm) =>
          dm.senderId === sender._id ||
          get(dm, "challengeParams.userId") === sender._id
      )
    );

  listSubscriptions = () =>
    map(
      this.props.activity.subscriptions || {},
      (subscriptionInfo, subscriptionKey) => {
        if (subscriptionInfo.deletedAt) {
          return "";
        }

        const userSubscription = find(
          userSubscriptions,
          (subscription) => subscription.source.type === subscriptionKey
        );

        return (
          <ActivitySubscription
            key={`subscription_${subscriptionKey}`}
            subscriptionKey={subscriptionKey}
            subscriptionInfo={subscriptionInfo}
            userSubscription={userSubscription}
            activateSubscription={activateSubscription}
            cancelSubscription={cancelSubscription}
            reactivateSubscription={reactivateSubscription}
          />
        );
      }
    );

  //console.log("This is just a test console log for PR testing and deployment stuff").

  subscriptionManagement = () => {
    // if (
    //   !Roles.userIsInRole(userId, ["full-control"], "admins") &&
    //   !Roles.userIsInRole(userId, ["full-control"], "editors")
    // ) {
    //   return "";
    // }

    return (
      Activities.findOne({ _id: this.props.activity._id }).createdBy ===
        Meteor.user()._id && (
        <Button
          color="primary"
          onClick={() =>
            FlowRouter.go("this.props.activity.subscriptions", {
              activity: this.props.activity._id,
            })
          }
        >
          Subscription management
        </Button>
      )
    );
  };

  // this fetches the owner info
  getOwnerInfo = (id) => {
    const senders = Meteor.users.find({ _id: id }).fetch();
    if (senders.length === 0) return "Sports Network Admin"; //throw  new Meteor.Error(404, 'User info not found ');
    return senders[0].profile.firstName;
  };

  // this fetches the owner email info
  getOwnerEmail = (id) => {
    const senders = Meteor.users.find({ _id: id }).fetch();
    console.log("skv senders", Meteor.users.find({ _id: id }).fetch());
    if (senders.length === 0) return "NA"; //throw  new Meteor.Error(404, 'User info not found ');
    return senders[0].registered_emails[0].address;
  };

  // Get total Members count
  getDivisionmembersCount = (activityId) => {
    let divisions = Divisions.find({
      activityId: { $in: [activityId] },
    }).fetch();

    // Logical explanation : retrieve all unique users from avialable divisions and make a string compilation
    var totalMembersCountString = "";
    divisions.map((div) => {
      let uniqueUsers = [];
      let users = div.users;
      users.map((user) => {
        if (uniqueUsers.indexOf(user.id) === -1) {
          uniqueUsers.push(user.id);
        }
      });
      totalMembersCountString =
        totalMembersCountString +
        div.title +
        " : " +
        "'" +
        uniqueUsers.length +
        "' , ";
    });
    return totalMembersCountString;
  };

  render() {
    const {
      loading,
      activity,
      divisions,
      myDivisions,
      places,
      events,
      passedEvents,
      divisionMessages,
      members,
      sendMessage,
      joinDivision,
      addFriend,
      sendChallengeRequest,
      joinEvent,
      addScore,
      userId,
      user,
      senders,
      userSubscriptions,
      activateSubscription,
      cancelSubscription,
      reactivateSubscription,
      notRegisteredMembers,
      activityDivisions,
    } = this.props;
    let Division = GenericDivision;
    let MyDivision = GenericMyDivision;

    if (find(this.props.activity.type, (type) => type === "1on1")) {
      // Division = OneOnOneDivision;
      MyDivision = OneOnOneMyDivision;
    }

    const chosenDivisionTitle = "Just for fun";

    console.log("printed props ", this.props);

    return loading ? (
      <div>Loading .... </div>
    ) : (
      <div>
        <Grid divided="vertically">
          <Grid.Row columns={3}>
            <Grid.Column width={5}>
              <Image
                centered
                rounded
                size="medium"
                src={
                  !!activity.activityImage()
                    ? activity
                        .activityImage()
                        .url({ store: "homeActivitiesImages" })
                    : "/img/discover-more.jpg"
                }
              />
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as="h1">{activity.title} </Header>
              <Header as="h5">
                <Icon name="map marker" size="small" />
                Helsinki, Finland
              </Header>
              <Header as="h5">
                <Icon name="users" size="small" />
                Members : {this.getDivisionmembersCount(activity._id)}
              </Header>
              <Header as="h5">
                <Icon name="user" size="small" />
                Club Organiser: {this.getOwnerInfo(activity.createdBy)}
              </Header>
              <Header as="h5">
                <Icon name="envelope" size="small" />
                Contact : {this.getOwnerEmail(activity.createdBy)}
              </Header>
              <Header as="h5">{activity.description} </Header>
            </Grid.Column>
            <Grid.Column width={4}>
              {Meteor.user() ? (
                activity.createdBy === Meteor.user()._id ? (
                  <div>
                    <Header as="h3"> Add member to the division </Header>
                    <Form
                      className="ui addUserByMail"
                      onSubmit={(e) => this.onClickHandler(e)}
                    >
                      <Form.Field>
                        <input
                          type="email"
                          placeholder="example@mail.com"
                          name="email"
                          className="input__field"
                        />
                      </Form.Field>
                      <Form.Field>
                        <select
                          onChange={(e) =>
                            this.onSelectChangeHandle(e.target.value)
                          }
                          name="select"
                          style={{ margin: "5px 0px 5px 0px" }}
                          defaultValue={
                            activity.clubType === "sport"
                              ? chosenDivisionTitle
                              : ""
                          }
                        >
                          <option value="" disabled>
                            Choose division
                          </option>
                          {activityDivisions.map((item) => (
                            <option key={item._id} value={item.title}>
                              {item.title}
                            </option>
                          ))}
                        </select>
                      </Form.Field>

                      <Button color="primary" type="submit">
                        Add Member
                      </Button>
                    </Form>
                  </div>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={8}>
            <Grid.Column width={8}>
              <Header as="h2"> All Subscriptions </Header>
            </Grid.Column>
            <Grid.Column width={8}>
              {Meteor.user() ? () => this.subscriptionManagement() : ""}
            </Grid.Column>
            {/* <Grid.Column width={8}>
                <Form>
                  <Form.Field>
                    <label>First Name</label>
                    <input placeholder="First Name" />
                  </Form.Field>
                  <Form.Field
                    control={TextArea}
                    label="About"
                    placeholder="Tell us more about you..."
                  ></Form.Field>
                  <Form.Field>
                    <Checkbox label="I agree to the Terms and Conditions" />
                  </Form.Field>
                  <Button type="submit">Submit</Button>
                </Form>
              </Grid.Column> */}
          </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {myDivisions.map(div => (
                  <h1>`${div}`</h1>
                 ) )}
              </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

Activity.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  activity: React.PropTypes.object,
  divisions: React.PropTypes.array,
  myDivisions: React.PropTypes.array,
  places: React.PropTypes.array,
  events: React.PropTypes.array,
  passedEvents: React.PropTypes.array,
  divisionMessages: React.PropTypes.array,
  members: React.PropTypes.array,
  sendMessage: React.PropTypes.func.isRequired,
  joinDivision: React.PropTypes.func.isRequired,
  addFriend: React.PropTypes.func.isRequired,
  sendChallengeRequest: React.PropTypes.func.isRequired,
  joinEvent: React.PropTypes.func.isRequired,
  addScore: React.PropTypes.func.isRequired,
  userId: React.PropTypes.string,
  user: React.PropTypes.object,
  senders: React.PropTypes.array,
  userSubscriptions: React.PropTypes.arrayOf(
    React.PropTypes.instanceOf(Subscription)
  ),
  activateSubscription: React.PropTypes.func.isRequired,
  cancelSubscription: React.PropTypes.func.isRequired,
  reactivateSubscription: React.PropTypes.func.isRequired,
};

Activity.defaultProps = {
  activity: {},
};

export default Activity;
