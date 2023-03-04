import React, { useState } from "react";
import { List } from "react-native-paper";
import { ScrollView, Text } from "react-native";
import Colors from "../../constants/Colors";

const TechnicalIssueFaqs = () => {
  const [q1, setq1] = useState(false);
  const [q2, setq2] = useState(false);
  const [q3, setq3] = useState(false);

  const _handleq1 = () => {
    setq1(!q1);
    setq2(false);
    setq3(false);
  };
  const _handleq2 = () => {
    setq1(false);
    setq2(!q2);
    setq3(false);
  };
  const _handleq3 = () => {
    setq1(false);
    setq2(false);
    setq3(!q3);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <List.Section>
        {/* Question No 1 */}
        <List.Accordion
          title={
            "How do I report a technical issue related to procurementleague.com?"
          }
          titleStyle={{ color: q1 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q1}
          onPress={() => _handleq1()}
        >
          <Text style={{ padding: 15 }}>
            To report a technical issue with procurementleague.com, please email
            contactus@procurementleague.com. We appreciate your feedback.
          </Text>
        </List.Accordion>

        {/* Question No 2 */}
        <List.Accordion
          title={
            "Why haven't I received any emails regarding Procurement League Events/Newsletters for a while?"
          }
          titleStyle={{ color: q2 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q2}
          onPress={() => _handleq2()}
        >
          <Text style={{ padding: 15 }}>
            We are sorry you have not been receiving our emails. Spam filter
            settings on your computer or company network could be one of the
            reasons. Please email us at contactus@procurementleague.com, and we
            will attempt to identify the cause. If your Internet provider or
            email application filters incoming email, please add
            procurementleague.com to your list of approved senders to ensure
            that you receive our email newsletters and alerts.
          </Text>
        </List.Accordion>

        {/* Question No 3 */}
        <List.Accordion
          title={"Why can't I download a Whitepaper?"}
          titleStyle={{ color: q3 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q3}
          onPress={() => _handleq3()}
        >
          <Text style={{ padding: 15 }}>
            Please note that only registered members can download Whitepapers.
            To view Whitepaper PDF files, you must have Adobe Reader installed
            on your computer. To obtain a copy of this software, please visit
            the Adobe website.
          </Text>
        </List.Accordion>
      </List.Section>
    </ScrollView>
  );
};

export default TechnicalIssueFaqs;
