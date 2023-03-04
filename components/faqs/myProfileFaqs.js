import React, { useState } from "react";
import { List } from "react-native-paper";
import { ScrollView, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";

const MyProfileFaqs = () => {
  const [q1, setq1] = useState(false);
  const [q2, setq2] = useState(false);
  const [q3, setq3] = useState(false);
  const [q4, setq4] = useState(false);
  const [q5, setq5] = useState(false);
  const [q6, setq6] = useState(false);
  const [q7, setq7] = useState(false);
  const [q8, setq8] = useState(false);

  const _handleq1 = () => {
    setq1(!q1);
    setq2(false);
    setq3(false);
    setq4(false);
    setq5(false);
    setq6(false);
    setq7(false);
    setq8(false);
  };
  const _handleq2 = () => {
    setq1(false);
    setq2(!q2);
    setq3(false);
    setq4(false);
    setq5(false);
    setq6(false);
    setq7(false);
    setq8(false);
  };
  const _handleq3 = () => {
    setq1(false);
    setq2(false);
    setq3(!q3);
    setq4(false);
    setq5(false);
    setq6(false);
    setq7(false);
    setq8(false);
  };
  const _handleq4 = () => {
    setq1(false);
    setq2(false);
    setq3(false);
    setq4(!q4);
    setq5(false);
    setq6(false);
    setq7(false);
    setq8(false);
  };
  const _handleq5 = () => {
    setq1(false);
    setq2(false);
    setq3(false);
    setq4(false);
    setq5(!q5);
    setq6(false);
    setq7(false);
    setq8(false);
  };
  const _handleq6 = () => {
    setq1(false);
    setq2(false);
    setq3(false);
    setq4(false);
    setq5(false);
    setq6(!q6);
    setq7(false);
    setq8(false);
  };
  const _handleq7 = () => {
    setq1(false);
    setq2(false);
    setq3(false);
    setq4(false);
    setq5(false);
    setq6(false);
    setq7(!q7);
    setq8(false);
  };
  const _handleq8 = () => {
    setq1(false);
    setq2(false);
    setq3(false);
    setq4(false);
    setq5(false);
    setq6(false);
    setq7(false);
    setq8(!q8);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <List.Section>
        {/* Question No 1 */}
        <List.Accordion
          title={
            "I forgot my procurementleague.com password. How do I reset it?"
          }
          titleStyle={{ color: q1 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q1}
          onPress={() => _handleq1()}
        >
          <Text style={{ padding: 15 }}>
            If you don't remember your password, please follow the instructions
            on the Forgot Your Password? (add the link to Forgot Your Password)
            page. If your Internet provider or email application filters
            incoming email, please add procurementleague.com to your list of
            approved senders to ensure that you receive our reset password
            email.
          </Text>
        </List.Accordion>

        {/* Question No 2 */}
        <List.Accordion
          title={
            "I tried to reset my password but didn't receive a reset email?"
          }
          titleStyle={{ color: q2 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q2}
          onPress={() => _handleq2()}
        >
          <Text style={{ padding: 15 }}>
            Unfortunately, spam blockers sometimes prevent our emails from
            getting through. If your Internet provider or email application
            filters incoming email, please add procurementleague.com to your
            list of approved senders to ensure that you receive our reset
            password email. After doing so, you may need to go through the reset
            process again.
          </Text>
        </List.Accordion>

        {/* Question No 3 */}
        <List.Accordion
          title={"Why should I register as a Member?"}
          titleStyle={{ color: q3 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q3}
          onPress={() => _handleq3()}
        >
          <Text style={{ padding: 15 }}>
            Most whitepapers, articles, free access to events and classes, and
            other material on procurementleague.com are exclusively available to
            our members. Most of the time, we will ask you to register or log in
            to our site before registering for an event or downloading the
            whitepapers. As a registered member of procurementleague.com, you
            can also sign up for our regular email newsletters and receive
            alerts when new content is available. Your registration credentials
            will also work on the Procurement League app, offering mobile access
            to our content and additional personalization options.To take
            advantage of these services, please register now (add the link to
            Sign-in).
          </Text>
        </List.Accordion>

        {/* Question No 4*/}
        <List.Accordion
          title={"What is the membership fee for joining Procurement League?"}
          titleStyle={{ color: q4 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q4}
          onPress={() => _handleq4()}
        >
          <Text style={{ padding: 15 }}>
            Procurement League is an education platform where procurement and
            supply chain enthusiasts can come and learn about how to be a better
            procurement professional, and we do it all for FREE.
          </Text>
        </List.Accordion>

        {/* Question No 5 */}
        <List.Accordion
          title={
            "When I tried to create an account, I received an error message stating that 'email address is already in use.' "
          }
          titleStyle={{ color: q5 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q5}
          onPress={() => _handleq5()}
        >
          <Text style={{ padding: 15 }}>
            Our system requires a unique email address for each member profile.
            You are receiving this error message because the email address you
            entered is already associated with a profile, most likely one you
            set up previously. If you don't remember your password, please
            follow the instructions on the Forgot Your Password? (add the link
            to Forgot Your Password) page. If your Internet provider or email
            application filters incoming email, please add procurementleague.com
            to your list of approved senders to ensure that you receive our
            reset password email.
          </Text>
        </List.Accordion>

        {/* Question No 6 */}
        <List.Accordion
          title={"How do I update my profile information?"}
          titleStyle={{ color: q6 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q6}
          onPress={() => _handleq6()}
        >
          <Text style={{ padding: 15 }}>
            To update your profile information, please log in to
            procurementleague.com, click on your picture/name in the upper-right
            corner of any page, then edit your details.
          </Text>
        </List.Accordion>

        {/* Question No 7 */}
        <List.Accordion
          title={"How do I sign up for email newsletters and alerts?"}
          titleStyle={{ color: q7 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q7}
          onPress={() => _handleq7()}
        >
          <Text style={{ padding: 15 }}>
            Our newsletters and alerts keep procurementleague.com members
            informed about the latest content and events from Procurement
            League. If you would like to take advantage of this service, please
            register (add the link to Sign-in) and opt-in for the email
            newsletters. If you are not a registered member, you can still
            opt-in for our Newsletter (add the link to Newsletter) page.
          </Text>
        </List.Accordion>

        {/* Question No 8 */}
        <List.Accordion
          title={"How is my personal information protected?"}
          titleStyle={{ color: q8 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q8}
          onPress={() => _handleq8()}
        >
          <Text style={{ padding: 15 }}>
            Procurement League is committed to respecting your privacy and
            protecting your personal identification information. Please see our
            privacy policy for more details. I still can't resolve my
            registration issue. Can I contact Procurement League? Please email
            questions and concerns regarding registration to
            contactus@procurementleague.com.
          </Text>
        </List.Accordion>
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: FontFamily.Regular,
    color: Colors.blackColor,
    fontSize: 14,
  },
  title: {
    fontFamily: FontFamily.Medium,
    color: Colors.blackColor,
    fontSize: 14,
  },
});
export default MyProfileFaqs;
