import React, { useState } from "react";
import { List } from "react-native-paper";
import { ScrollView, Text, View } from "react-native";
import Colors from "../../constants/Colors";

const DiscussionForumFaqs = () => {
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
            "What makes a great discussion on the Procurement League Discussion Forum?"
          }
          titleStyle={{ color: q1 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q1}
          onPress={() => _handleq1()}
        >
          <Text style={{ padding: 15 }}>
            A great Procurement League Discussion would meet some of the
            following attributes:
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ paddingLeft: 15 }}>{"\u25CF"}</Text>
            <Text style={{ padding: 10, paddingTop: 0, paddingRight: 20 }}>
              It addresses a Procurement problem that many practitioners would
              like to see solved.
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ paddingLeft: 15 }}>{"\u25CF"}</Text>
            <Text style={{ padding: 10, paddingTop: 0, paddingRight: 25 }}>
              It excites the community to jump in and solve the problem while
              still seeming achievable.
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ paddingLeft: 15 }}>{"\u25CF"}</Text>
            <Text style={{ padding: 10, paddingTop: 0 }}>
              It encourages community engagement, collaboration, and
              competition.
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ paddingLeft: 15 }}>{"\u25CF"}</Text>
            <Text style={{ padding: 10, paddingTop: 0, paddingRight: 25 }}>
              It addresses a problem area where there is a scope for
              improvement.
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ paddingLeft: 15 }}>{"\u25CF"}</Text>
            <Text style={{ padding: 10, paddingTop: 0, paddingRight: 20 }}>
              Inspire a new way to think about a procurement and sourcing
              problem.
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ paddingLeft: 15 }}>{"\u25CF"}</Text>
            <Text style={{ padding: 10, paddingTop: 0, paddingRight: 20 }}>
              Spark discussions, imagination, and encourage many people to
              search for the solution.
            </Text>
          </View>
        </List.Accordion>
        {/* Question No 2 */}
        <List.Accordion
          title={"Why and how are some questions deleted?"}
          titleStyle={{ color: q2 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q2}
          onPress={() => _handleq2()}
        >
          <Text style={{ padding: 15 }}>
            Moderators reserve the right to remove significantly off-topic
            questions or questions of poor quality at the community's
            discretion. Over time, closed questions that are not useful in
            context to other questions may also be removed. Questions that have
            no significant activity over a very long period after being asked
            will be removed.{"\n"}
            {"\n"}Users can delete their questions if the question has no
            answers. If you want to improve a question to keep it from being
            deleted, click the update button beneath it and then click the
            delete link underneath the question.
            {"\n"} {"\n"} The community can also delete questions.{"\n"}
            {"\n"}
            Moderators can delete any question; the question will be
            automatically removed if the answer accumulates enough offensive and
            spam flags.
          </Text>
        </List.Accordion>
        {/* Question No 3 */}
        <List.Accordion
          title={"What should I do if nobody answers my question?"}
          titleStyle={{ color: q3 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q3}
          onPress={() => _handleq3()}
        >
          <Text style={{ padding: 15 }}>
            First, make sure you've asked a good question. You may need to put
            additional effort into your question to get better answers. Edit
            your question to provide status and progress updates. Document your
            own continued efforts to answer your question. Doing so will
            naturally bump your question to the homepage and get more people
            interested in it. Despite your best efforts, you feel questions
            aren't getting good answers; you can help by offering small
            non-tangible awards.
          </Text>
        </List.Accordion>
        {/* Question No 4 */}
        <List.Accordion
          title={"What should I do when someone answers my question?"}
          titleStyle={{ color: q4 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q4}
          onPress={() => _handleq4()}
        >
          <Text style={{ padding: 15 }}>
            Decide if the answer is helpful, and then Vote on it (Like practical
            and well-researched answers, and dislike answers that are not).
            {"\n"}
            {"\n"}Other users can also vote on answers to your question.{"\n"}
            Please do not add a comment on your question or an answer to say
            "Thank you."
            {"\n"} {"\n"}Use comments to request clarification, leave
            constructive criticism, or add relevant but minor additional
            information – not for socializing. If you want to say "thank you,"
            vote on that person's answer or pay it forward by providing a great
            response to someone else's question.
          </Text>
        </List.Accordion>
        {/* Question No 5 */}
        <List.Accordion
          title={
            "How can I improve the chances of getting my question answered? "
          }
          titleStyle={{ color: q5 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q5}
          onPress={() => _handleq5()}
        >
          <View style={{ padding: 15 }}>
            <Text style={{ paddingBottom: 15 }}>
              A great Procurement League Discussion would meet some of the
              following attributes:
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text>{"\u25CF"}</Text>
              <Text style={{ padding: 10, paddingTop: 0 }}>
                <Text style={{ fontWeight: "bold" }}>
                  {`Pretend you're talking to a busy colleague `}
                </Text>
                <Text>
                  and have to sum up your entire question in one sentence: what
                  details can you include that will help someone identify and
                  solve your problem?
                </Text>
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Spelling, grammar, and punctuation are necessary!
                </Text>
                <Text>
                  Remember, this is the first part of your question others will
                  see - you want to make a good impression. If you're not
                  comfortable writing in English, ask a friend to proofread it
                  for you.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Include all relevant tags
                </Text>
                <Text>
                  Try to include a tag for the topic, category, area of
                  expertise, area of interest related to the specific question:
                  If you start typing in the tags field, the system will suggest
                  tags that match what you are typing.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Proofread before posting
                </Text>
                <Text>
                  Now that you're ready to ask your question take a deep breath
                  and read through it from start to finish. Pretend you're
                  seeing it for the first time: does it make sense? Try
                  reproducing the problem yourself in a new environment and make
                  sure you can do so using only the information included in your
                  question. Add any details you missed and read through it
                  again. Now is an excellent time to ensure that your title
                  still describes the problem!
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Post the question and respond to feedback
                </Text>
                <Text>
                  After you post, leave the question open in your browser for a
                  bit, and see if anyone comments. If you missed a prominent
                  piece of information, be ready to respond by editing your
                  question to include it. If someone posts an answer, be
                  prepared to try it out and provide feedback.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Be nice</Text>
                <Text>
                  Whether you've come to ask questions or to share what you know
                  generously, remember that we're all here to learn together. Be
                  welcoming and patient, especially with those who may not know
                  everything you do.
                </Text>
              </View>
            </View>

            <Text
              style={{ paddingBottom: 15, paddingTop: 5, fontWeight: "bold" }}
            >
              Oh, and bring your sense of humor, just in case.
            </Text>
            <Text style={{ paddingBottom: 15, paddingTop: 0 }}>
              That covers it. But these three guidelines may help:
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Rudeness and belittling language are not okay.
                </Text>
                <Text>
                  Your tone should match the way you'd talk in person with
                  someone you respect and whom you want to respect. If you don't
                  have time to say something politely, leave it for someone who
                  does.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Be welcoming, be patient, and assume good intentions.
                </Text>
                <Text>
                  Don't expect new users to know all the rules — they don't. And
                  be patient while they learn. I
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Don't be a jerk.</Text>
                <Text>
                  These are just a few examples. If you see them, flag them:
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Name-calling</Text>
                <Text>
                  Focus on the post, not the person. That includes terms that
                  feel personal even when they're applied to posts (like "lazy,"
                  "ignorant," or "whiny").
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  The bigotry of any kind.
                </Text>
                <Text>
                  Language likely to offend or alienate individuals or groups
                  based on race, gender, sexual orientation, religion, etc.,
                  will not be tolerated. (Those are just a few examples; when in
                  doubt, don't.) At all.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Inappropriate language or attention.
                </Text>
                <Text>
                  Avoid vulgar terms and anything sexually suggestive. Also,
                  this is not a dating site.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Harassment and bullying.
                </Text>
                <Text>
                  If you see a hostile interaction, flag If it keeps up,
                  disengage — we'll handle it. If something needs staff
                  attention, you can use the contact us link at the bottom of
                  every page.
                </Text>
              </View>
            </View>

            <Text>
              We're proud to be ample, user-driven space on the internet where
              name-calling, Harassment, and other online nastiness are almost
              non-existent. It's up to all of us to keep it that way.{"\n"}
              {"\n"}
              In summary, have fun, and be good to each other.
              {"\n"}
            </Text>
          </View>
        </List.Accordion>

        {/* Question No 6 */}
        <List.Accordion
          title={"What kind of behavior is expected from users?"}
          titleStyle={{ color: q6 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q6}
          onPress={() => _handleq6()}
        >
          <View style={{ padding: 15 }}>
            <Text style={{ paddingBottom: 15 }}>
              We're excited to have you here, but we ask that you follow a few
              guidelines when participating in our Procurement League Community.
            </Text>

            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Be honest.</Text>
                <Text>
                  Above all, be honest. If you see misinformation, vote it down.
                  Add comments indicating what, specifically, is wrong. Provide
                  better answers of your own. By doing these things, you are
                  helping keep Procurement League a great place to share
                  knowledge of our craft.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Be nice.</Text>
                <Text>
                  Whether you've come to ask questions or to share what you know
                  generously, remember that we're all here to learn together. Be
                  welcoming and patient, especially with those who may not know
                  everything you do. Oh, and bring your sense of humor, just in
                  case.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Do not use signatures, taglines, or greetings.
                </Text>
                <Text>
                  Every post you make is already "signed" with your standard
                  user credentials, directly linking to your user page. Using an
                  additional signature or tagline will be removed to reduce
                  noise in the questions and answers. Your user page belongs to
                  you — fill it with information about your interests, links to
                  stuff you've worked on, or whatever else you like!
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Avoid overt self-promotion.
                </Text>
                <Text>
                  Some but not all answers about your product or website are
                  okay. However, you must disclose your affiliation in your
                  answers. The community tends to vote down overt self-promotion
                  and flag it as spam.{"\n"}
                  {"\n"} If a large percentage of your posts include a mention
                  of your product or website, you're probably here for the wrong
                  reasons. Our advertising rates are quite reasonable; contact
                  the Procurement League sales team for details at
                  contactus@procurementleague.com
                </Text>
              </View>
            </View>
          </View>
        </List.Accordion>
        {/* Question No 7 */}
        <List.Accordion
          title={"How do I report Harassment?"}
          titleStyle={{ color: q7 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q7}
          onPress={() => _handleq7()}
        >
          <Text style={{ padding: 15 }}>
            Procurement League provides its users with an environment that feels
            comfortable and protected. We do not condone Harassment on our sites
            and take harassment reports seriously.
          </Text>
        </List.Accordion>

        {/* Question No 8 */}
        <List.Accordion
          title={"What Constitutes Harassment?"}
          titleStyle={{ color: q8 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q8}
          onPress={() => _handleq8()}
        >
          <View style={{ padding: 15 }}>
            <Text style={{ paddingBottom: 15 }}>
              Systematic or continued behaviors that afflict or demean someone
              in a way that would make a reasonable person fear for their safety
              or the safety of those around them constitute Harassment.
              Following a user or a group of users, on or offline, to the point
              where they start feeling unsafe to post online or fear their
              safety is Harassment.
            </Text>

            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Okay, I'm being harassed; what do I do?
                </Text>
                <Text>
                  Please use our contact form; try to be as specific and
                  straightforward as possible, and provide links to relevant
                  posts, comments, chat messages, etc. We recommend that you
                  also flag them in the meantime; if you want to make sure they
                  are removed and handled faster — we'll still have a look even
                  if a moderator has taken action before we get to your report.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  What happens once I submit a report?
                </Text>
                <Text>
                  We look at every report individually, and you'll always get a
                  reply back from us, regardless of the outcome. We will look at
                  your message and the relevant posts/comments/messages it
                  mentions and gather as much context as possible. If we
                  determine that the behaviors reported do indeed constitute
                  Harassment, we'll take action (which may range from a warning
                  to suspending the user).
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>{"\u25CF"}</Text>
              </View>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Can you give me another user's information?
                </Text>
                <Text>
                  As per our Privacy Policy, we do not give out user information
                  except as required by a valid legal process. If you are
                  working with the police or your lawyer, check the appropriate
                  and correct legal methods for obtaining such information. If
                  we are contacted directly by law enforcement, we will work
                  with them and investigate them.
                </Text>
              </View>
            </View>
          </View>
        </List.Accordion>
      </List.Section>
    </ScrollView>
  );
};

export default DiscussionForumFaqs;
