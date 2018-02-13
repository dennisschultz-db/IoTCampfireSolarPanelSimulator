
## IoT Campfire Solar Panel Simulator Sample App

Includes Lightning components and a custom Lightning page that can be used to simulate and monitor the platform events used in the Salesforce Cirrus Solar demo.

## Installation Instructions

1. Authenticate with your hub org (if not already done):
    ```
    sfdx force:auth:web:login -d -a myhuborg
    ```

1. Clone the northern-trail repository:
    ```
    git clone https://github.com/dschultz-mo/IoTCampfireSolarPanelSimulator.git
    cd IoTCampfireSolarPanelSimulator
    ```

1. Create a scratch org and provide it with an alias (iot):
    ```
    sfdx force:org:create -s -f config/project-scratch-def.json -a iot
    ```

1. Push the app to your scratch org:
    ```
    sfdx force:source:push
    ```

1. Assign the IoT_Simulator permission set to the default user:
    ```
    sfdx force:user:permset:assign -n IoT_Simulator
    ```

1. Open the scratch org:
    ```
    sfdx force:org:open
    ```

1. Click the **Cirrus Solar Device Simulators** tab

1. Enter values into the simulator component and **Send**

1. Event will be sent and will appear in the corresponding monitor component

## Customization
The Lightning components are generic in nature with preset parameters making them applicable for Cirrus Solar.  You can use them for any Platform Event project by customizing the parameters of the components.

1.  From the **Cirrus Solar Device Simulators** tab, **Setup > Edit Page**

1.  Select a **IoT Device Simulator** component

1.  Enter the name of your Platform Event in **Event Name** and enter the Platform Event Field Key in **Device Id**.

1.  Change the values of **Heading Text** and **Heading Icon** if you wish.

1.  You can also upload an image to be displayed as a Static Resource, then enter its name in **Image Static Resource Name**.

1.  Edit the **IoT Event Monitor** parameters in a similar way
