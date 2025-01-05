import React from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Policies = () => {
  const guidelines = [
    {
      title: "General Guidelines",
      subsections: [
        {
          subtitle: "Account Information:",
          items: [
            "Keep your account details (email, phone, address) up to date.",
            "Use accurate and valid registration details; false information may lead to account suspension.",
          ],
        },
        {
          subtitle: "Respectful Communication:",
          items: [
            "Engage respectfully with others on the platform. Discriminatory or offensive language is strictly prohibited.",
          ],
        },
        {
          subtitle: "Data Privacy",
          items: [
            "Do not share or misuse private information obtained through the platform.",
          ],
        },
      ],
    },
    {
      title: "Marketplace Participation",
      subsections: [
        {
          subtitle: "Product Quality (Suppliers):",
          items: [
            "All products must meet local legal standards.",
            "Maintain proper descriptions for products.",
          ],
        },
        {
          subtitle: "Order Management:",
          items: [
            "Confirm or decline orders within 48 hours.",
            "Retailers must pay for accepted orders within the agreed timeline.",
            "Suppliers must deliver products as per the agreed timeline and terms.",
          ],
        },
        {
          subtitle: "Quotation Transparency:",
          items: [
            "Retailers: Submit clear and accurate requirements.",
            "Suppliers: Provide transparent and competitive pricing without hidden fees.",
          ],
        },
      ],
    },
    {
      title: "Complaints and Disputes",
      subsections: [
        {
          subtitle: "Filing Complaints:",
          items: [
            "Retailers and suppliers may file complaints for violations (e.g., poor product quality, delayed payments/deliveries).",
          ],
        },
      ],
    },
    {
      title: "Penalty Triggers",
      subsections: [
        {
          subtitle:
            "Retailers and suppliers are subject to penalties for violations, such as:",
          items: [
            "Late order confirmations or deliveries.",
            "Payment delays.",
            "Misuse of the platform or unethical conduct.",
          ],
        },
      ],
    },
    {
      title: "Score System (Transparency Section)",
      items: [
        "Your score reflects your compliance and trustworthiness.",
        "Your score affects the product appearance in the marketplace (Suppliers).",
        "Score deductions occur for violations, and you can recover points through positive actions.",
      ],
    },
  ];

  const scoreRecovery = [
    "+5 points per resolved case.",
    "+10 points for maintaining a clean record for 3 months.",
    "+5 points for completing missing profile information.",
  ];

  return (
    <Container>
      <h2 className="fw-bold mb-2">Policies</h2>
      <h6 className="mb-4">
        This page will act as a guidelines hub for retailers and suppliers,
        ensuring they understand their responsibilities and how to avoid
        penalties.
      </h6>
      {guidelines.map((section, index) => (
        <div key={index} className="mb-4">
          <h5 className="fw-bold">{section.title}</h5>
          {section.subsections ? (
            section.subsections.map((subsection, subIndex) => (
              <div key={subIndex} className="mb-3">
                <ul style={{ listStyleType: "disc" }}>
                  <li>{subsection.subtitle}</li>
                  <ul>
                    {subsection.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </ul>
              </div>
            ))
          ) : (
            <ul>
              {section.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <div className="mb-4">
        <h5 className="fw-bold">Score Thresholds and Consequences</h5>
        <Table bordered hover>
          <thead>
            <tr>
              <th>Score Range</th>
              <th>Status</th>
              <th>Consequence</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>80–100</td>
              <td>Good</td>
              <td>Full privileges and marketplace trust.</td>
            </tr>
            <tr>
              <td>60–79</td>
              <td>Under Warning</td>
              <td>Minor warning issued for improvement.</td>
            </tr>
            <tr>
              <td>40–59</td>
              <td>Restricted</td>
              <td>Restricted visibility on the marketplace.</td>
            </tr>
            <tr>
              <td>Below 40</td>
              <td>Suspended</td>
              <td>Temporary suspension until score improves.</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div>
        <h5 className="fw-bold mb-1">Score Recovery Options</h5>
        <h6 className="fw-bold">Users can recover lost points by:</h6>
        <ul>
          {scoreRecovery.map((recoveryOption, index) => (
            <li key={index}>{recoveryOption}</li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default Policies;
