# README #

## Introduction ##

This repository is for the medcalc tool, a web application that helps healthcare providers (primarily doctors and nurses) quickly and easily convert a Parkinson’s patient’s regular medicine into an equivalent dose of another medicine. 

The need for this tool is based on the fact that sometimes patients with Parkinson's Disease (PD) who have been admitted to hospital are unable to take their medications orally. Therefore the patient's usual oral medications need to be converted to a 'Levodopa equivalent dose' (LED), which is delivered either through a patch or via a naso-gastric tube.

## Version ##

This project is be based upon an [old, existing version of the Medcalc](https://bitbucket.org/tpximpactdx/pdmedcalc-old/src/main/) tool that was built by another another developer.

This is therefore v2 of the medcalc tool.

## Set up ##

1. Clone the repo to your machine
2. cd into the directory where you cloned it
3. Run ```npm install``` to install dependencies

### How to start the dev server ###

Run ```npm run dev``` to start the development server and visit [http://localhost:3000](http://localhost:3000) to see the home page


## How it works ##

### Program flow ###

![Program flow](/assets/readme-images/program-flow.png)

- Users land on the home page, read the information presented and accept the disclaimer. This redirects the user to the calculator page.
- On the calculator page, users enter the respective medications and frequencies using the select dropdowns and the add button. Once the user is done adding medicines they then submit the form by clicking on the calculate button. This redirects the user to the results page.
- The medicines and frequencies the user entered on the calculator page are on the search params of the url. If these are missing (for example because the user went straight to /results and skipped the calculator page), the user is automatically redirected to the home page. If however they are present as expected, then the results page uses them to present to the user:
  1. what was entered on the calculator page
  2. a calculation of the total levodopa equivalent dose (in mg per day)
  3. a conversion of the entered medications to a dispersible madopar split across four dose times i.e. option 1
  4. a conversion of medications to a transdermal rotigotine patch i.e. option 2


### The calculation rules ###

See the 'rules of the calculator doc' for a detailed explanation written by James Fisher.

### Implementation ###

Although this project uses javascript rather than typescript, the types for the expected inputs and outputs of the various functions are nonetheless described for the sake of clarity.

#### Data storage ####

No user data is stored. The only data this app stores is related to the medicines themselves. 

This app therefore does not have a database because it does not really need one since there are only 56 different medicines and we only need to know three different properties of each; having a database for the sake of one table with four columns and just 56 entries is unnecessary.

The data related to the medicines is in ```src/app/data/data.js```.

##### The medications object #####

The ```medications``` object is of the type :

```ts
type Medications = {
  string : {
    led: number
    isDa: boolean
    isComt: boolean
  }
} 
```

Each property of the ```medications``` object is a string representing the name of that medicine. The value of this property is an object with ```led```, ```isDa``` and ```isComt``` properties. 

```led``` represents the levodopa equivalent dose for one unit of this medicine.

```isDa``` represents whether or not this medicine is a dopamine agonist.

```isComt``` represents whether or not this medicine is a comt inhibitor.

#### Functions ####

All the functions responsible for the actual conversion of the medicines are in ```src/app/calculator/calculator-functions.js```.

These functions are written in a functional programming style; they are __pure__ i.e. they take an input and return an output without mutating the original input or having any other side-effect. 

##### The mainTransform function #####

![mainTransform](/assets/readme-images/mainTransform.png)

The ```mainTransform``` function takes an array of medicine objects. Each medicine object is formed by looping through the search params of the results page's url and is of the type

```ts
{
  name: string
  frequencyPerDay: number
}
```

The two options object that the ```mainTransform``` function returns is of the type

```ts
{
  option1: TimeMadoparObject
  option2: number
}
```

where 

```ts
type TimeMadoparObject = {
  "0800": TimeMadparTuple
  "1200": TimeMadparTuple
  "1600": TimeMadparTuple
  "2000": TimeMadparTuple
}
```

and

```ts
type TimeMadparTuple = [
  { name: 'Madopar Dispersible 125mg (25/100mg)', quantity: number, led: 100 },
  { name: 'Madopar Dispersible 62.5mg (12.5/50mg)', quantity: number, led: 50 }
]
```

##### The calculateRotigotine function #####

![calculateRotigotine](/assets/readme-images/calculateRotigotine.png)

The ```calculateRotigotine``` function takes an array of medicine objects and returns a number representing the equivalent patchdose in mg for these medicines.

The patchdose is calculated by:

- splitting out the dopamine agonists from the non-dopamine agonists
- calculating the total led of the dopamine agonists and the total led of the non-dopamine agonists
- dividing the totalLedOfDopamineAgonists by the adjustment (30)
- multiplying the totalLedOfNonDopamineAgonists by the correction factor (0.25) and then divding the result by the adjustment (30)
- summing the results of the previous two steps
- rounding the result to a multiple of 2


##### The calculateTotalLed function #####

![calculateTotalLed](/assets/readme-images/calculateTotalLed.png)

The ```calculateTotalLed``` function takes an array of medicine objects and returns a number representing the total levodopa equivalent dose for these medicines.

This total led is calculated by:

- splitting out the comt inhibtors from the non-comt inhibitors
- calculating the total led of the non-comt inhibitors by multiplying the frequencyPerDay of each medicine with its led and all the results
- picking out the comt inhibitor with the largest totalLedAdjustment* and multiplying its totalLedAdjustment against the totalLedFromNonComtInhibitors
- summing the totalLedFromNonComtInhibitors and the result of the previous step


*Note that, in practice, _"patients would only ever be on one COMT inhibitor, since [...] wouldn't prescribe more than one of them as there would be no value in doing so (once the COMT enzyme is blocked, it's blocked)"_. The function nevertheless handles the case where a user might input multiple comt inhibitors on the calculator page


##### The calculateMadopar function #####

![calculateMadopar](/assets/readme-images/calculateMadopar.png)

The ```calculateMadopar``` function takes a targetLED and returns a ```TimeMadoparObject``` representing an equivalent total led in the form of dispersible madopar split across four dose times.

This is calculated by:

- rounding the targetLED to the nearest 50 since the dispersible madopar comes in two sizes 50 (small) and 100 (big)
- finding every possible combination of big and small madopars whose totalLed equals the roundedTargetLed
- for each of the above combinations, allocating the big and small madopars to four time zones to create a TimeMadoparObject for each
- for each TimeMadoparObject above calculating the maximum spread between the total leds of the four dose times
- returning the TimeMadoparObject which has the lowest max spread (i.e. the one in which the doses are most evenly spread across the four time slots)


##### The allocateMadopar function #####

![allocateMadopar](/assets/readme-images/allocateMadopar.png)

The ```allocateMadopar``` function takes two arguments; ```noOfBigMadopars``` and ```noOfSmallMadopars```. It returns a ```TimeMadoparObject``` representing an equivalent total led in the form of dispersible madopar split across four dose times.

This allocation is done by:

- looping through the big madopars and placing one in each time slot (starting at 0800) until there are none left
- looping through the small madopars and placing one in each time slot (starting at the time slot which has the fewest big madopars) until there are none left


##### The calculateMaxSpread function #####

![calculateMaxSpread](/assets/readme-images/calculateMaxSpread.png)

The ```calculateMaxSpread``` function takes a ```TimeMadoparObject``` and returns a number representing the maximum difference in total leds between the time slot with the highest total led and the time slot with the lowest total led.

This is calculated by:

- calculating the total led for each time slot
- calculating the difference in total leds between each time slot
- returning the maximum difference in total led between the time slots

## Tests ##

### Testing straregy ###



### How to run the tests ###

Run ```npm run test```

