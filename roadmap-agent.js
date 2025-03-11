import dotenv from "dotenv";
dotenv.config();
import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import { genkit, z } from "genkit";

const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
  model: gemini20Flash,
});

//Roadmap Node Custom Schema
const RoadmapNodeSchema = z.object({
  node_id: z.string().describe("Unique identifier for the node"),
  topic: z.string().describe("Topic of the node"),
  description: z.string().describe("Description of the node"),
  summary: z.string().describe("Summary of the node"),
  difficulty: z.string().describe("Difficulty of the node"),
  estimated_time: z.string().describe("Estimated time to complete the node"),
});

//Roadmap Custom Schema
const RoadmapSchema = z.object({
  roadmap: z.array(RoadmapNodeSchema).describe("List of nodes in the roadmap"),
});

//Custom Roadmap Flow
export const roadmapFlow = ai.defineFlow(
    //Flow Name: Roadmap Flow
    //Input Schema: String
    //Output Schema: Roadmap Schema (Custom Schema)
  {
    name: "roadmapFlow",
    inputSchema: z.string(),
    outputSchema: RoadmapSchema,
  },
  async (text) => {
    const { output } = await ai.generate({
      model: gemini20Flash,
      system:
        "You are an AI roadmap generator that creates personalized study plans based on the provided text. Your task is to analyze document content holistically to extract key learning topics and structure an optimal roadmap",
      prompt: `Create a detailed roadmap for the given text: ${text}`,
      config: {
        temperature: 0,
      },
      output: { schema: RoadmapSchema },
    });
    if (output == null) {
      throw new Error("Failed to generate output");
    }
    console.log(output);
    return output;
  }
);

const roadmap =
  await roadmapFlow(`The Future of Renewable Energy: A Strategic Roadmap for Global Sustainability

As we stand on the cusp of a new era, the world faces an unprecedented challenge: the urgent need to transition from fossil fuels to renewable energy sources. Climate change, driven by excessive carbon emissions, poses a grave threat to ecosystems, economies, and human health. However, with innovation, cooperation, and strategic planning, a sustainable future is within reach. This document outlines a comprehensive roadmap for the future of renewable energy, providing a clear framework for action across various sectors, governments, and industries.

1. Understanding the Current Energy Landscape
The global energy landscape today is heavily reliant on fossil fuels, with oil, coal, and natural gas accounting for over 80% of energy consumption worldwide. While renewable energy sources like solar, wind, hydro, and geothermal have seen substantial growth over the past few decades, they still represent a small fraction of the global energy mix. This disparity can be attributed to several factors, including technological limitations, high initial investment costs, infrastructure challenges, and the entrenched interests of traditional energy industries.

In order to chart a course toward a greener future, it is essential to understand the current energy landscape and the barriers that prevent a faster shift to renewable sources. Governments, private enterprises, and individuals must work in unison to address these challenges.

2. Key Areas of Focus for Renewable Energy Development
2.1 Technological Innovation
At the core of the transition to renewable energy lies technological innovation. New and improved technologies are crucial to reducing costs, increasing efficiency, and expanding the availability of renewable energy sources. This includes advancements in solar photovoltaic (PV) cells, wind turbine design, battery storage solutions, and energy grid integration.

Additionally, breakthroughs in energy storage technology will be essential for overcoming the intermittent nature of renewable energy. The development of next-generation batteries, such as solid-state and lithium-sulfur batteries, as well as alternative energy storage methods like pumped hydro storage, will be key to ensuring that renewable energy can provide a stable and reliable power supply.

2.2 Policy and Regulatory Framework
Governments play a pivotal role in shaping the future of renewable energy through policy and regulation. Implementing supportive policies, such as tax incentives, subsidies for clean energy projects, and carbon pricing mechanisms, will create an environment that encourages investment in renewable technologies. Similarly, removing fossil fuel subsidies and putting in place stricter regulations on emissions will make the economic case for renewable energy even stronger.

In addition to national policies, international cooperation is critical to addressing the global nature of climate change. Global agreements like the Paris Agreement have set ambitious targets for reducing carbon emissions and limiting global warming. To meet these targets, countries must work together to share knowledge, technologies, and best practices.

2.3 Infrastructure Development
Transitioning to renewable energy also requires a massive overhaul of existing infrastructure. The global energy grid was built for centralized fossil fuel-based power generation and distribution. As renewable energy sources like solar and wind are often decentralized and variable, new infrastructure must be built to accommodate this shift.

Smart grids, which can manage the flow of energy in real-time, will play a key role in integrating renewable sources into the energy mix. Additionally, the expansion of electric vehicle (EV) charging networks and the development of green hydrogen infrastructure will support the widespread adoption of clean technologies across multiple sectors.

2.4 Financial Investment and Market Structures
The transition to renewable energy requires significant investment, not only in the development of new technologies but also in scaling existing solutions. Public and private sector investment will be necessary to fund large-scale renewable energy projects, such as offshore wind farms, solar power plants, and battery storage facilities.

In addition to capital investment, market structures must be aligned with the goals of a green economy. Financial instruments, such as green bonds and renewable energy certificates, can provide the necessary funding while ensuring that investments are directed toward sustainable projects. A shift toward a circular economy, where resources are reused and waste is minimized, will further support the financial sustainability of renewable energy systems.

3. Roadmap for Achieving a Sustainable Energy Future
3.1 Short-Term Goals (1-5 Years)
Investment in Research and Development (R&D): Governments and private entities should increase funding for R&D in renewable energy technologies to drive innovation and reduce costs.
Establishment of Carbon Pricing Mechanisms: Implement carbon pricing and emissions trading systems to make fossil fuels less economically viable compared to renewable energy.
Incentives for Early Adoption: Offer financial incentives for the early adoption of renewable energy systems, such as solar panels, electric vehicles, and energy-efficient appliances.
Development of Regional Energy Hubs: Create regional hubs for renewable energy production and distribution to reduce reliance on centralized fossil fuel-based power grids.
3.2 Medium-Term Goals (5-15 Years)
Scaling Up Renewable Energy Capacity: Increase the share of renewable energy in the global energy mix to at least 50% by 2035, with a focus on solar, wind, and hydroelectric power.
Expansion of Energy Storage Solutions: Achieve widespread deployment of advanced battery storage technologies to ensure grid stability and reliable power supply from renewable sources.
International Cooperation on Climate Action: Strengthen international agreements and collaborations to facilitate the transfer of renewable energy technologies and expertise to developing countries.
Job Creation in the Green Economy: Invest in workforce training and education programs to equip individuals with the skills needed to thrive in the renewable energy sector.
3.3 Long-Term Goals (15-30 Years)
Complete Transition to Renewable Energy: Achieve a fully decarbonized energy system by 2050, with renewable energy sources providing the majority of the world’s power needs.
Global Carbon Neutrality: Ensure that global carbon emissions are reduced to net-zero levels through a combination of renewable energy, carbon capture, and other climate solutions.
Sustainable Urbanization: Promote the integration of renewable energy systems in urban development, with smart cities and green infrastructure that prioritize sustainability.
Global Leadership in Clean Technologies: Position renewable energy technologies as a global export, leading the world in clean energy innovations and solutions.
4. Conclusion
The transition to renewable energy is not just an environmental imperative, but also an economic and social opportunity. By investing in innovation, adopting supportive policies, developing the necessary infrastructure, and fostering international cooperation, we can build a sustainable and resilient global energy system. This roadmap provides a clear and actionable pathway to achieving a future where clean, renewable energy powers the world, benefiting generations to come.`);

console.log(roadmap);
