import React, { useState } from "react";
import { List } from "react-native-paper";
import { ScrollView, Text } from "react-native";
import Colors from "../../constants/Colors";

const ProcureClassFaqs = () => {
  const [q1, setq1] = useState(false);
  const [q2, setq2] = useState(false);
  const [q3, setq3] = useState(false);
  const [q4, setq4] = useState(false);

  const _handleq1 = () => {
    setq1(!q1);
    setq2(false);
    setq3(false);
    setq4(false);
  };
  const _handleq2 = () => {
    setq1(false);
    setq2(!q2);
    setq3(false);
    setq4(false);
  };
  const _handleq3 = () => {
    setq1(false);
    setq2(false);
    setq3(!q3);
    setq4(false);
  };
  const _handleq4 = () => {
    setq1(false);
    setq2(false);
    setq3(false);
    setq4(!q4);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <List.Section>
        {/* Question No 1 */}
        <List.Accordion
          title={"What are the advantages of online learning at ProcureClass?"}
          titleStyle={{ color: q1 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q1}
          onPress={() => _handleq1()}
        >
          <Text style={{ padding: 15 }}>
            ProcureClass is an online learning platform of the future that
            blends time-tested pedagogy with innovative training experiences and
            executive content tailored to the busy lives of procurement
            professionals on the go. With academically robust and
            application-oriented frameworks, learners get a chance to build
            skills to help them navigate their first job or the most crucial
            career cusps. Our unique curriculum allows learners to build skills
            to succeed at every stage of their careers. Our development programs
            majorly target different career stages. It includes interactive
            elements like hands-on-tool workshops, industry mentorship, and
            practice exercises to apply course concepts.
          </Text>
        </List.Accordion>

        {/* Question No 2 */}
        <List.Accordion
          title={
            "How does ProcureClass customize its programs to specific company needs?"
          }
          titleStyle={{ color: q2 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q2}
          onPress={() => _handleq2()}
        >
          <Text style={{ padding: 15 }}>
            The ProcureClass is known for outcome-based online learning. At the
            beginning of the program, we benchmark learner skills to set the
            baseline. The benchmarking exercise considers a learner's specific
            context and workplace environment. The benchmark helps us map a
            learner's/team's progress throughout the program.
          </Text>
        </List.Accordion>

        {/* Question No 3 */}
        <List.Accordion
          title={
            "How are ProcureClass's programs relevant for my organization or team's learning needs?"
          }
          titleStyle={{ color: q3 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q3}
          onPress={() => _handleq3()}
        >
          <Text style={{ padding: 15 }}>
            ProcureClass's distinctive flagship programs are designed and
            tailored for first-time procurement professionals, high-performing
            early managers, women leaders, and more./n Our unique program
            approach begins by benchmarking procurement skills to set a
            baseline, identify the correct program elements, and map progress
            throughout learning. Each of our programs is mapped to a specific
            set of Procurement Skills and the crucial learning outcomes that
            learners will develop by the end of their learning journey with
            ProcureClass.
          </Text>
        </List.Accordion>

        {/* Question No 4 */}
        <List.Accordion
          title={
            "My employees have busy work schedules. How will online learning help them, and can the learning time be optimized for their work schedules?"
          }
          titleStyle={{ color: q4 ? Colors.primaryColor : Colors.blackColor }}
          titleNumberOfLines={3}
          expanded={q4}
          onPress={() => _handleq4()}
        >
          <Text style={{ padding: 15 }}>
            Our ProcureClass training programs are designed by keeping in mind
            that Procurement Professionals are busy and ambitious. Our online
            training program is self-paced, which can be completed at a
            learner's convenience. You can learn online no matter where in the
            world you are. We also provide live learning support on Procurement
            League App to ensure learners can ask questions or clarify doubts at
            any time during the learning journey.
          </Text>
        </List.Accordion>
      </List.Section>
    </ScrollView>
  );
};

export default ProcureClassFaqs;
