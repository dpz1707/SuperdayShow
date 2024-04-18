import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { addUser, addUserIndustries, getRandomCompanies } from "../awsAuth";
import InternExampleVertical from '../../images/internExampleVertical.png';
import WhiteLogo from '../../images/logoWhite.svg'
import { useNavigate } from 'react-router-dom';
import { getUserData, updateInfo, upsertUser } from "../awsAuth";
import { FiCopy } from "react-icons/fi";
import emailjs from 'emailjs-com';
import { useForm } from 'react-hook-form';

export default function EditInfo() {
    const { user, isAuthenticated } = useAuth0();
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [university, setUniversity] = useState('');
    const [year_in_school, setYearInSchool] = useState('');
    const [coffee_chat_email, setCoffeeChatEmail] = useState();
    const [paragraph_subject_line, setParagraphSubjectLine] = useState('');
    const [recruiting_email, setRecruitingEmail] = useState();
    const [copyStatus, setCopyStatus] = useState({});
    const [onboardStep, setOnboardStep] = useState(0);
    const [editableUniversity, setEditableUniversity] = useState('');
    const [user_origin, setUserOrigin] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        setEditableUniversity(university);
    }, [university]);

    const handleChange = (e) => {
        setEditableUniversity(e.target.value);
    };

    const schoolList = ['Abilene Christian University', 'Academy Of Art College', 'Adams State College', 'Adelphi University', 'Adler School Of Professional Psychology', 'Adrian College', 'Agnes Scott College', 'Air Force Institute Of Technology', 'Alabama Agricultural And Mechanical University', 'Alabama State University', 'Alaska Bible College', 'Alaska Pacific University', 'Albany College Of Pharmacy', 'Albany Law School', 'Albany Medical Center', 'Albany State University', 'Albertus Magnus College', 'Albion College', 'Albright College', 'Alcorn State University', 'Alderson Broaddus College', 'Alfred Adler Graduate School', 'Alfred University', 'Alice Lloyd College', 'Allegheny College', 'Allen University', 'Alma College', 'Alvernia College', 'Alverno College', 'Ambassador University', 'Amber University', 'American Academy Of Nutrition', 'American Business & Technology University', 'American Conservatory Of Music', 'American Conservatory Theater', 'American-European School Of Management ', 'American Film Institute Center For Advanced Film And Television Studies', 'American Indian College', 'American Intercontinental University - Atlanta', 'American Intercontinental University - Ft. Lauderdale', 'American Intercontinental University - Georgia', 'American Intercontinental University Online', 'American International College', 'American Jewish University', 'American Military University', 'American Public University', 'American University', 'American World University', 'Amherst College', 'Anderson College', 'Anderson University', 'Andon College - Modesto', 'Andon College - Stockton', 'Andrew Jackson University', 'Andrews University', 'Angelo State University', 'Anna Maria College', 'Antioch New England Graduate School', 'Antioch University', 'Antioch University Los Angeles', 'Antioch University Santa Barbara', 'Antioch University Seattle', 'Appalachian Bible College', 'Appalachian State University', 'Aquinas College', 'Arcadia University', 'Argosy University', 'Argosy University - Hawaii', 'Arizona Christian University', 'Arizona State University', 'Arizona State University, Downtown Phoenix Campus', 'Arizona State University, Polytechnic Campus', 'Arizona State University, Tempe Campus', 'Arizona State University, West Campus', 'Arkansas State University', 'Arkansas State University, Beebe', 'Arkansas State University, Mountain Home', 'Arkansas State University, Newport', 'Arkansas Tech University', 'Arlington Baptist College', 'Armstrong Atlantic State University', 'Armstrong University', 'Art Academy Of Cincinnati', 'Art Center College Of Design', 'Arthur D. Little Management Education Institute', 'Art Institute Of Charlotte', 'Art Institute Of Southern California', 'Asbury College', 'Ashland University', 'Assumption College', 'Athenaeum Of Ohio', 'Athens State College', 'Atlanta Christian College', 'Atlanta College Of Art', 'Atlantic International University', 'Atlantic Union College', 'Atlantic University', 'Auburn University', 'Auburn University At Montgomery', 'Audrey Cohen College', 'Augsburg College', 'Augustana College', 'Augustana College', 'Augusta State University', 'Aurora University', 'Austin College', 'Austin Community College', 'Austin Peay State University', 'Ave Maria University', 'Averett College', 'Avila College', 'Azusa Pacific University', 'Babson College', 'Baker College Of Auburn Hills', 'Baker College Of Cadillac', 'Baker College Of Flint', 'Baker College Of Mount Clemens', 'Baker College Of Muskegon', 'Baker College Of Owosso', 'Baker College Of Port Huron', 'Baker University', 'Baldwin-Wallace College', 'Ball State University', 'Baltimore Hebrew University', 'Baltimore International College', 'Bank Street College Of Education', 'Baptist Bible College Of Missouri', 'Baptist Bible College Of Pennsylvania', 'Barat College', 'Barber-Scotia College', 'Barclay College', 'Bard College', 'Bard Graduate Center For Studies In The Decorative Arts', 'Barnard College - Columbia University', 'Barry University', 'Bartlesville Wesleyan College', 'Barton College', 'Bastyr University', 'Bates College', 'Bauder College', 'Baylor College Of Dentistry', 'Baylor College Of Medicine', 'Baylor University', 'Belhaven College', 'Bellarmine College', 'Bellevue University', 'Bellin College Of Nursing', 'Belmont Abbey College', 'Belmont University', 'Beloit College', 'Bemidji State Univeristy', 'Benedict College', 'Benedictine College', 'Benedictine University', 'Benedictine University, Springfield College In Illinois', 'Bennett College', 'Bennington College', 'Bentley College', 'Berea College', 'Berean University Of The Assemblies Of God', 'Berklee College Of Music', 'Berne University', 'Berry College', 'Bethany College California', 'Bethany College Kansas', 'Bethany College West Virginia', 'Bethel College Mckenzie', 'Bethel College Mishawaka', 'Bethel College Newton', 'Beth-El College Of Nursing And Health Sciences', 'Bethel College St. Paul', 'Bethune-Cookman College', 'Biola University', 'Birmingham-Southern College', 'Blackburn College', 'Black Hawk College', 'Black Hills State University', 'Blessing-Rieman College Of Nursing', 'Bloomfield College', 'Bloomsburg University Of Pennsylvania', 'Bluefield College', 'Bluefield State College', 'Blue Mountain College', 'Bluffton College', 'Bob Jones University', 'Boise Bible College', 'Boise State University', 'Boricua College', 'Boston Architectural Center', 'Boston College', 'Boston University', 'Bowdoin College', 'Bowie State University', 'Bowling Green State University', 'Bowling Green State University, Firelands', 'Bradley University', 'Brandeis University', 'Brandman University', 'Brenau University', 'Brescia University', 'Brevard College', 'Brewton-Parker College', 'Breyer State University (Virtual University)', 'Briar Cliff College', 'Bridgewater College', 'Bridgewater State College', 'Brigham Young University', 'Brigham Young University', 'Brigham Young University Hawaii', 'Brooklyn Law School', 'Brooks Institute Of Photography', 'Brown University', 'Brunswick Community College', 'Bryan College', 'Bryant And Stratton College', 'Bryant University', 'Bryn Athyn College Of The New Church', 'Bryn Mawr College', 'Bucknell University', 'Buena Vista University', 'Burlington College', 'Butler University', 'Cabrini College', 'Caldwell College', 'California Baptist College', 'California Coast University', 'California College For Health Sciences', 'California College Of Arts And Crafts', 'California College Of Podiatric Medicine', 'California College San Diego', 'California Institute Of Integral Studies', 'California Institute Of Technology', 'California Institute Of The Arts', 'California Lutheran University', 'California Maritime Academy', 'California Polytechnic State University - San Luis Obispo', 'California School Of Professional Psychology - Berkley/Alameda', 'California School Of Professional Psychology - Fresno', 'California School Of Professional Psychology - Los Angels', 'California School Of Professional Psychology - San Diego', 'California State Polytechnic University - Pomona', 'California State University, Bakersfield', 'California State University, Channel Islands', 'California State University, Chico', 'California State University, Dominguez Hills', 'California State University, Fresno', 'California State University, Fullerton', 'California State University, Hayward', 'California State University, Long Beach', 'California State University, Los Angeles', 'California State University, Monterey Bay', 'California State University, Northridge', 'California State University, Sacramento', 'California State University, San Bernadino', 'California State University, San Marcos', 'California State University, Stanislaus', 'California University Of Management And Sciences', 'California University Of Pennsylvania', 'California Western School Of Law', 'Calumet College Of St. Joseph', 'Calvary Bible College', 'Calvin College', 'Cambridge College', 'Cameron University', 'Campbellsville College', 'Campbell University', 'Canisius College', 'Capella University', 'Capital University', 'Capital University Law School', 'Capitol College', 'Cardinal Stritch University', 'Carleton College', 'Carlos Albizu University', 'Carlow College', 'Carnegie Mellon University', 'Carroll College Helena', 'Carroll College Waukesha', 'Carson-Newman College', 'Carthage College', 'Case Western Reserve University', 'Castleton State College', 'Catawba College', 'Catholic Theological Union', 'Cedar Crest College', 'Cedarville College', 'Centenary College', 'Centenary College Of Louisiana', 'Center For Humanistic Studies', 'Central Baptist College', 'Central Bible College', 'Central Christian College Of The Bible', 'Central College', 'Central Connecticut State University', 'Central Methodist College', 'Central Michigan University', 'Central State University', 'Central Washington University', 'Centre College', 'Chadron State College', 'Chaminade University Of Honolulu', 'Champlain College', 'Chapman University', 'Charles R. Drew University Of Medicine And Science', 'Charleston Southern University', 'Charter Oak State College', 'Chatham College', 'Chestnut Hill College', 'Cheyney University Of Pennsylvania', 'Chicago State University', 'Chowan College', 'Christendom College', 'Christian Brothers University', 'Christian Heritage College', 'Christopher Newport University', 'Circleville Bible College', 'City University', 'City University Of New York, Bernard M. Baruch College', 'City University Of New York, Brooklyn College', 'City University Of New York, City College', 'City University Of New York, College Of Staten Island', 'City University Of New York (Cuny) System', 'City University Of New York, Graduate School And University Center', 'City University Of New York, Hunter College', 'City University Of New York, John Jay College Of Criminal Justice', 'City University Of New York, Lehman College', 'City University Of New York, Medgar Evers College', 'City University Of New York Medical School / Sophie Davis School Of Biomedical Education', 'City University Of New York, New York City Technical College', 'City University Of New York, Queens College', 'City University Of New York, School Of Law At Queens College', 'City University Of New York, York College', 'Claflin College', 'Claremont Graduate University', 'Claremont Lincoln University', 'Claremont Mckenna College', 'Clarion University', 'Clark Atlanta University', 'Clarke College', 'Clarkson College', 'Clarkson University', 'Clark University', 'Clayton College & State University', 'Clearwater Christian College', 'Cleary College', 'Clemson University', 'Cleveland Chiropractic College, Kansas City', 'Cleveland Chiropractic College, Los Angeles', 'Cleveland Institute Of Art', 'Cleveland Institute Of Music', 'Cleveland State University', 'Coastal Carolina University', 'Coe College', 'Cogswell Polytechnical College', 'Coker College', 'Colby College', 'Colby-Sawyer College', 'Coleman College', 'Colgate University', 'Collegeamerica, Denver', 'Collegeamerica, Phoenix', 'College For Creative Studies', 'College For Financial Planning', 'College For Lifelong Learning', 'College Misericordia', 'College Of Aeronautics', 'College Of Charleston', 'College Of Dupage', 'College Of Idaho', 'College Of Mount St. Joseph', 'College Of Mount St. Vincent', 'College Of New Rochelle', 'College Of Notre Dame', 'College Of Notre Dame Of Maryland', 'College Of Osteopathic Medicine Of The Pacific (Western University Of Health Sciences)', "College Of St. Benedict And St. John'S University", 'College Of St. Catherine', 'College Of St. Elizabeth', 'College Of St. Joseph', 'College Of St. Mary', 'College Of St. Rose', 'College Of St. Scholastica', 'College Of The Atlantic', 'College Of The Holy Cross', 'College Of The Ozarks', 'College Of Visual Arts', 'College Of William And Mary', 'Colorado Christian University', 'Colorado College', 'Colorado School Of Mines', 'Colorado State University', 'Colorado State University-Pueblo', 'Colorado Technical University', 'Columbia College Chicago', 'Columbia College Hollywood', 'Columbia College Of Missouri', 'Columbia College South Carolina', 'Columbia Commonwealth University', 'Columbia International University', 'Columbia Southern University', 'Columbia Union College', 'Columbia University', 'Columbus College Of Art And Design', 'Columbus State University', 'Columbus University', 'Community College Of Denver', 'Concord College', 'Concordia College, Ann Arbor', 'Concordia College, Bronxville', 'Concordia College, Moorhead', 'Concordia College, Selma', 'Concordia College, Seward', 'Concordia College, St. Paul', 'Concordia University, Austin', 'Concordia University, Irvine', 'Concordia University, Mequon', 'Concordia University, Portland', 'Concordia University, River Forest', 'Connecticut College', 'Converse College', 'Conway School Of Landscape Design', 'Coppin State College', 'Cornell College', 'Cornell University', 'Cornish College Of The Arts', 'Cosmopolitan University', 'Covenant College', 'Cranbrook Academy Of Art', 'Creighton University', 'Crichton College', 'Crown College', 'Culver-Stockton College', 'Cumberland College', 'Cumberland University', 'Curry College', 'Daemen College', 'Dakota State University', 'Dakota Wesleyan University', 'Dallas Baptist University', 'Dallas Christian College', 'Dana College', 'Daniel Webster College', 'Danville Area Community College', 'Dartmouth College', 'Darton College', 'Davenport College Of Business, Grand Rapids', 'Davenport College Of Business, Kalamazoo', 'Davenport College Of Business, Lansing', 'Davidson College', 'Davis And Elkins College', 'Deaconess College Of Nursing', 'Delaware State University', 'Delaware Valley College', 'Delta International University', 'Delta State University', 'Denison University', 'Denver Paralegal Institute', 'Denver Technical College', 'Depaul University', 'Depauw University', 'Desales University', 'Design Institute Of San Diego', 'Detroit College Of Business', 'Detroit College Of Business - Flint', 'Detroit College Of Business - Warren', 'Detroit College Of Law', 'Devry Institute Of Technology, Chicago', 'Devry Institute Of Technology, Columbus', 'Devry Institute Of Technology, Decatur', 'Devry Institute Of Technology, Dupage', 'Devry Institute Of Technology, Irving', 'Devry Institute Of Technology, Kansas City', 'Devry Institute Of Technology, Phoenix', 'Devry Institute Of Technology, Pomona', 'Dickinson College', 'Dickinson State University', 'Dillard University', 'Divine Word College', 'Dixie College', 'Doane College', 'Dominican College', 'Dominican College Of San Rafael', 'Dominican School Of Philosophy And Theology', 'Dominican University', 'Dominion College', 'Dordt College', 'Dowling College', 'Drake University', 'Drew University', 'Drexel University', 'Drury College', 'Duke University', 'Duluth Business University', 'Duquesne University', "D'Youville College", 'Earlham College', 'Earthnet Institute', 'East Carolina University', 'East Central University', 'Eastern College', 'Eastern Connecticut State University', 'Eastern Conservatory Of Music', 'Eastern Illinois University', 'Eastern Kentucky University', 'Eastern Mennonite University', 'Eastern Michigan University', 'Eastern Nazarene College', 'Eastern New Mexico University', 'Eastern Oregon University', 'Eastern Virginia Medical School', 'Eastern Washington University', 'East Stroudsburg State University', 'East Tennessee State University', 'East Texas Baptist University', 'East-West University', 'Eckerd College', 'Edgewood College', 'Edinboro University Of Pennsylvania', 'Edison Community College', 'Edward Waters College', 'Elizabeth City State University', 'Elizabethtown College', 'Elmhurst College', 'Elmira College', 'Elms College', 'Elon College', 'Embry-Riddle Aeronautical University', 'Embry Riddle Aeronautical University, Prescott', 'Emerson College', 'Emmanuel College', 'Emmanuel College Georgia', 'Emmaus Bible College', 'Emory & Henry College', 'Emory University', 'Emporia State University', 'Erskine College', 'Eugene Bible College', 'Eureka College', 'Evangel University', 'Evergreen State College', 'Excel College', 'Excelsior College', 'Fairfield University', 'Fairleigh Dickinson University, Florham-Madison Campus', 'Fairleigh Dickinson University, Teaneck-Hackensack Campus', 'Fairmont State College', 'Fashion Institute Of New York', 'Faulkner University', 'Fayetteville State University', 'Felician College', 'Ferris State University', 'Ferrum College', 'Fielding Institute', 'Finch University Of Health Sciences - The Chicago Medical School', 'Finlandia University', 'Fisher College', 'Fisk University', 'Fitchburg State College', 'Flagler College', 'Florida Agricultural And Mechanical University', 'Florida Atlantic University', 'Florida Christian College', 'Florida Community College At Jacksonville', 'Florida Gulf Coast University', 'Florida Institute Of Technology', 'Florida International University', 'Florida Memorial College', 'Florida Metropolitan University, Fort Lauderdale College', 'Florida Metropolitan University, Tampa College', 'Florida Metropolitan University, Tampa College Brandon', 'Florida Metropolitan University, Tampa College Lakeland', 'Florida Southern College', 'Florida State University', 'Florida University Of Medicine', 'Fontbonne College', 'Foothill-De Anza Community College District', 'Fordham University', 'Forest Institute Of Professional Psychology', 'Fort Hays State University', 'Fort Lewis College', 'Fort Valley State College', 'Framingham State College', 'Franciscan School Of Theology', 'Franciscan University Of Steubenville', 'Francis Marion University', 'Franklin And Marshall College', 'Franklin College', 'Franklin Pierce College', 'Franklin Pierce Law Center', 'Franklin University', 'Franklin W. Olin College Of Engineering', 'Frank Lloyd Wright School Of Architecture', 'Fred Hutchinson Cancer Research Center', 'Freed-Hardeman University', 'Free University (Virginia Theological University)', 'Free Will Baptist Bible College', 'Fresno City College', 'Fresno Pacific University', 'Friends University', 'Frostburg State University', 'Full Sail University', 'Furman University', 'Gallaudet University', 'Gannon University', 'Gardner Webb University', 'Gemological Institute Of America', 'Geneva College', 'George Fox University', 'George Mason University', 'Georgetown College', 'Georgetown University', 'George Washington University', 'George Wythe College', 'Georgia Baptist College Of Nursing', 'Georgia College & State University', 'Georgia Health Sciences University', 'Georgia Institute Of Technology', 'Georgian Court College', 'Georgia School Of Professional Psychology', 'Georgia Southern University', 'Georgia Southwestern University', 'Georgia State University', 'Gettysburg College', 'Glendale University College Of Law', 'Glenville State College', 'Goddard College', "God'S Bible School And College", 'Golden Gate University', 'Goldey-Beacom College', 'Gonzaga University', 'Gordon College', 'Gordon Conwell Theological Seminary', 'Goshen College', 'Goucher College', 'Governors State University', 'Grace Bible College', 'Grace College', 'Graceland College', 'Grace University', 'Graduate Theological Union', 'Grambling State University', 'Grand Canyon University', 'Grand Valley State University', 'Grand View College', 'Grantham University', 'Gratz College', 'Great Lakes Christian College', 'Green Mountain College', 'Greensboro College', 'Greenville College', 'Grinnell College', 'Grove City College', 'Guilford College', 'Gustavus Adolphus College', 'Gwynedd-Mercy College', 'Hagerstown Community College', 'Hamilton College', 'Hamilton Technical College', 'Hamline University', 'Hampden-Sydney College', 'Hampshire College', 'Hampton College', 'Hampton University', 'Hannibal-Lagrange College', 'Hanover College', 'Harding University', 'Harding University Graduate School Of Religion', 'Hardin-Simmons University', 'Harrington Institute Of Interior Design', 'Harris-Stowe State University', 'Hartford College For Women', 'Hartford Graduate Center (Rensselaer At Hartford)', 'Hartwick College', 'Harvard University', 'Harvey Mudd College', 'Hastings College', 'Haverford College', 'Hawaii Pacific University', 'Heartland Baptist Bible College', 'Hebrew College', 'Heidelberg College', 'Henderson State Univerisity', 'Hendrix College', 'Heritage College', 'Hesser College', 'High Point University', 'Hilbert College', 'Hillsdale College', 'Hiram College', 'Hobart And William Smith Colleges', 'Hobe Sound Bible College', 'Hodges University', 'Hofstra University', 'Hollins University', 'Holy Apostles College', 'Holy Cross College', 'Holy Family College', 'Holy Names College', 'Hood College', 'Hope College', 'Hope International University', 'Houghton College', 'Houston Baptist University', 'Howard Payne University', 'Howard University', 'Humboldt State University', 'Humphreys College', 'Huntington College', 'Huron University', 'Husson College', 'Huston-Tillotson College', 'Ici University', 'Ict College', 'Idaho State University', 'Iglobal University', 'Illinois Benedictine University', 'Illinois College', 'Illinois College Of Optometry', 'Illinois Institute Of Technology', 'Illinois School Of Professional Psychology - Chicago Campus', 'Illinois School Of Professional Psychology - Meadows Campus', 'Illinois State University', 'Illinois Valley Community College', 'Illinois Wesleyan University', 'Immaculata University', 'Impac University', 'Indiana Institute Of Technologyy', 'Indiana State University', 'Indiana University At Bloomington', 'Indiana University At Kokomo', 'Indiana University At South Bend', 'Indiana University - East', 'Indiana University - Northwest', 'Indiana University Of Pennsylvania', 'Indiana University-Purdue University At Columbus', 'Indiana University-Purdue University At Fort Wayne', 'Indiana University-Purdue University At Indianapolis', 'Indiana University - Southeast', 'Indiana University (System)', 'Indiana Wesleyan University', 'Institute Of Clinical Social Work', 'Institute Of Paper Science And Technology', 'Institute Of Textile Technology', 'Institute Of Transpersonal Psychology', 'Intellitec College - Grand Junction', 'International Academy Of  Merchandising And Design Chicago', 'International Academy Of  Merchandising And Design Tampa', 'International Bible College', 'International College', 'Iona College', 'Iowa State University Of Science And Technology', 'Iowa Wesleyan College', 'Ithaca College', 'Itt Technical Institute Fort Wayne', 'Itt Technical Institute Indianapolis', 'Itt Technical Institute Maitland', 'Itt Technical Institute Portland', 'Itt Technical Institute West Covina', 'Jackson State University', 'Jacksonville State University', 'Jacksonville University', 'James Madison University', 'Jamestown College', 'Jarvis Christian College', 'John Brown University', 'John Carroll University', 'John F. Kennedy University', 'John Marshall Law School', 'John Paul The Great Catholic University', 'Johns Hopkins University', 'Johnson Bible College', 'Johnson County Community College', 'Johnson C. Smith University', 'Johnson State College', 'Johnson & Wales University', 'Johnson & Wales University, Charleston', 'John Wesley College', 'Jones College', 'Jones International University', 'Judson College Elgin', 'Judson College Marion', 'Juniata College', 'Kalamazoo College', 'Kankakee Community College', 'Kansas City Art Institute', 'Kansas State University', 'Kansas Wesleyan University', 'Kaplan University', 'Katharine Gibbs School', 'Kean University Of New Jersey', 'Keck Graduate Institute Of Applied Life Sciences', 'Keene State College', 'Keller Graduate School Of Management', 'Kendall College', 'Kendall College Of Art And Design', 'Kennesaw State University', 'Kent State University', 'Kent State University - Ashtabula', 'Kent State University - East Liverpool', 'Kent State University - Salem', 'Kent State University - Stark', 'Kent State University - Trumbull', 'Kent State University - Tuscarawas', 'Kentucky Christian College', 'Kentucky State University', 'Kentucky Wesleyan College', 'Kenyon College', 'Kettering University (Gmi)', 'Keuka College', 'King College', "King'S College", 'Kirksville College Of Osteopathic Medicine', 'Kirkwood Community College', 'Knox College', 'Knoxville College', 'Kutztown University Of Pennsylvania', 'Laboratory Institute Of Merchandising', 'Lafayette College', 'Lagrange College', 'Lake Erie College', 'Lake Forest College', 'Lake Forest Graduate School Of Management', 'Lakeland College', 'Lake Superior State University', 'Lakeview College Of Nursing', 'Lamar University', 'Lamar University - Port Arthur', 'Lambuth University', 'Lancaster Bible College', 'Lander University', 'Lane College', 'Langston University', 'La Roche College', 'La Salle University', 'Lasell College', 'La Sierra University', 'Laurus Technical Institute', 'Lawrence Technological University', 'Lawrence University', 'Lebanon Valley College', 'Lees-Mcrae College', 'Lee University', 'Lehigh Univervsity', 'Le Moyne College', 'Le Moyne-Owen College', 'Lenoir-Rhyne College', 'Lesley University', 'Letourneau University', 'Lewis And Clark College', 'Lewis & Clark Community College', 'Lewis-Clark State College', 'Lewis University', 'Liberty University', 'Life Chiropractic College West', 'Life University', 'Limestone College', 'Lincoln Memorial University', 'Lincoln University Missouri', 'Lincoln University Pennsylvania', 'Lincoln University San Francisco', 'Lindenwood University', 'Lindsey Wilson College', 'Linfield College', 'Lipscomb University', 'Livingstone College', 'Lock Haven University Of Pennsylvania', 'Logan College Of Chiropractic', 'Loma Linda University', 'Long Island University', 'Long Island University, C.W. Post Campus', 'Long Island University, Southampton College', 'Longwood College', 'Loras College', 'Los Angeles College Of Chiropractic', 'Louisiana Baptist University', 'Louisiana College', 'Louisiana State University And Agricultural And Mechanical College', 'Louisiana State University At Alexandria', 'Louisiana State University At Eunice', 'Louisiana State University Health Sciences Center New Orleans', 'Louisiana State University In Shreveport', 'Louisiana Tech University', 'Lourdes College', 'Loyola College In Maryland', 'Loyola Marymount University', 'Loyola University New Orleans', 'Loyola University Of Chicago', 'Lubbock Christian University', 'Lutheran Bible Institute Of Seattle', 'Luther College', 'Lycoming College', 'Lynchburg College', 'Lyndon State College', 'Lynn University', 'Lyon College', 'Macalester College', 'Macmurray College', 'Macon State College', 'Madison University (Distance Education)', 'Madonna University', 'Maharishi University Of Management', 'Maine College Of Art', 'Maine Maritime Academy', 'Malone College', 'Manchester College', 'Manhattan Christian College', 'Manhattan College', 'Manhattan School Of Music', 'Manhattanville College', 'Mankato State University', 'Mansfield University Of Pennsylvania', 'Maranatha Baptist Bible College', 'Marian College', 'Marian College Of Fond Du Lac', 'Marietta College', 'Marist College', 'Marlboro College', 'Marquette University', 'Marshall University', 'Mars Hill College', 'Martin Luther College', 'Martin Methodist College', 'Martin University', 'Mary Baldwin College', 'Marycrest International University', 'Marygrove College', 'Marylhurst University', 'Marymount College New York', 'Marymount Manhattan College', 'Marymount University', 'Maryville College', 'Maryville University Of St. Louis', 'Mary Washington College', 'Marywood University', 'Massachusetts College Of Art', 'Massachusetts College Of Liberal Arts', 'Massachusetts College Of Pharmacy And Allied Health Sciences', 'Massachusetts Institute Of Technology', 'Massachusetts Maritime Academy', 'Massachusetts School Of Professional Psychology', 'Mayo Graduate School', 'Mayo Medical School', 'Mayville State University', 'Mckendree College', 'Mcmurry University', 'Mcneese State University', 'Mcpherson College', 'Medaille College', 'Medcenter One College Of Nursing', 'Medical College Of Georgia', 'Medical College Of Ohio', 'Medical College Of Pennsylvania And Hahnemann University', 'Medical College Of Wisconsin', 'Medical University Of South Carolina', 'Meharry Medical College', 'Memphis College Of Art', 'Menlo College', 'Mennonite College Of Nursing', 'Mercer University', 'Mercer University, Cecil B. Day Campus', 'Mercy College', 'Mercyhurst College', 'Meredith College', 'Merrimack College', 'Mesa State College', 'Messiah College', 'Methodist College', 'Metropolitan State College Of Denver', 'Metropolitan State University', 'Mgh Institute Of Health Professions', 'Miami Dade College', 'Miami University Of Ohio', 'Miami University Of Ohio - Hamilton', 'Miami University Of Ohio - Middletown', 'Michigan School Of Professional Psychology', 'Michigan State University', 'Michigan Technological University', 'Mid-America Nazarene University', 'Mid-American Bible College', 'Mid-Continent Baptist Bible College', 'Middlebury College', 'Middle Tennessee State University', 'Midland Lutheran College', 'Midway College', 'Midwestern State University', 'Midwestern University', 'Miles College', 'Millennia Atlantic University', 'Millersville University Of Pennsylvania', 'Milligan College', 'Millikin University', 'Millsaps College', 'Mills College', 'Mills Grae University', 'Milwaukee Institute Of Art And Design', 'Milwaukee School Of Engineering', 'Minneapolis College Of Art And Design', 'Minnesota Bible College', 'Minnesota School Of Professional Psychology', 'Minot State University', 'Mississippi College', 'Mississippi State University', 'Mississippi University For Women', 'Mississippi Valley State University', 'Missouri Baptist College', 'Missouri Southern State College', 'Missouri Tech', 'Missouri University Of Science And Technology', 'Missouri Valley College', 'Missouri Western State College', 'Molloy College', 'Monmouth University', 'Montana State University', 'Montana State University - Billings', 'Montana State University - Northern', 'Montana Tech', 'Montclair State University', 'Monterey Institute Of International Studies', 'Montreat College', 'Montserrat College Of Art', 'Moody Bible Institute', 'Moore College Of Art And Design', 'Moorhead State University', 'Moraine Valley Community College', 'Moravian College', 'Morehead State University', 'Morehouse College', 'Morehouse School Of Medicine', 'Morgan State University', 'Morningside College', 'Morris Brown College', 'Morris College', 'Morrison College', 'Mountain State University', 'Mount Aloysius College', 'Mount Carmel College Of Nursing', 'Mount Holyoke College', 'Mount Ida College', 'Mount Marty College', 'Mount Mary College', 'Mount Mercy College', 'Mount Olive College', 'Mount Senario College', 'Mount Sinai School Of Medicine', 'Mount St. Clare College', 'Mount St. Mary College', "Mount St. Mary'S College California", "Mount St. Mary'S College Maryland", 'Mount Union College', 'Mount Vernon College', 'Mount Vernon Nazarene College', 'Muhlenberg College', 'Multnomah Bible College', 'Murray State University', 'Muskingum College', 'Naes College', 'National American University', 'National American University, Albuquerque', 'National American University, Colorado Springs', 'National American University, Denver', 'National American University, Kansas City', 'National American University, Roseville', 'National American University, Sioux Falls', 'National College Of Chiropractic', 'National College Of Naturopathic Medicine', 'National Defense University', 'National Hispanic University', 'National-Louis University', 'National Technological University', 'National Theatre Conservatory', 'National University', 'Naval Postgraduate School', 'Nazarene Bible College', 'Nazareth College', 'Nebraska Christian College', 'Nebraska Methodist College Of Nursing And Allied Health', 'Nebraska Wesleyan University', 'Neumann College', 'Newberry College', 'New College Of California', 'New College Of Florida', 'New England College', 'New England College Of Optometry', 'New England Conservatory Of Music', 'New England Institute Of Technology', 'New England School Of Art And Design', 'New England School Of Communications', 'New England School Of Law', 'New Hampshire College', 'New Jersey City University', 'New Jersey Institute Of Technology', 'Newman University', 'New Mexico Highlands University', 'New Mexico Institute Of Mining And Technology', 'New Mexico State University', 'Newschool Of Architecture And Design', 'New York Academy Of Art, Graduate School Of Figurative Art', 'New York Chiropractic College', 'New York College Of Podiatric Medicine', 'New York Film Academy', 'New York Institute Of Technology', 'New York Law School', 'New York Medical College', 'New York School Of Interior Design', 'New York University', 'Niagara University', 'Nicholls State University', 'Nichols College', 'Norfolk State University', 'North Carolina Agricultural And Technical State University', 'North Carolina Central University', 'North Carolina School Of The Arts', 'North Carolina State University', 'North Carolina Wesleyan College', 'North Central Bible College', 'North Central College', 'Northcentral University', 'North Dakota State University', 'Northeastern Illinois University', 'Northeastern Ohio University College Of Medicine', 'Northeastern State University', 'Northeastern University', 'Northern Arizona University', 'Northern Illinois University', 'Northern Kentucky University', 'Northern Michigan University', 'Northern State University', 'Northern Virginia Community College', 'Northface University', 'North Georgia College', 'North Greenville College', 'Northland College', 'North Park University', 'Northwest Christian College', 'Northwest College Of Art', 'Northwestern College Iowa', 'Northwestern College Of Chiropractic', 'Northwestern College St. Paul', 'Northwestern Oklahoma State University', 'Northwestern State University Of Louisiana', 'Northwestern University', 'Northwest Missouri State University', 'Northwest Nazarene University', 'Northwest University', 'Northwood University', 'Northwood University, Florida Campus', 'Northwood University, Texas Campus', 'Norwich University', 'Notre Dame College', 'Notre Dame College Of Ohio', 'Notre Dame De Namur University', 'Nova Southeastern University', 'Nyack College', 'Oakland City University', 'Oakland University', 'Oakton Community College', 'Oakwood College', 'Oberlin College', 'Occidental College', 'Oglala Lakota College', 'Oglethorpe University', 'Ohio College Of Podiatric Medicine', 'Ohio Dominican College', 'Ohio Northern University', 'Ohio State University', 'Ohio State University - Lima', 'Ohio State University - Mansfield', 'Ohio State University - Marion', 'Ohio State University - Newark', 'Ohio University', 'Ohio University - Chillicothe', 'Ohio University - Eastern', 'Ohio University - Lancaster', 'Ohio University - Southern', 'Ohio University - Zanesville', 'Ohio Valley College', 'Ohio Wesleyan University', 'Oklahoma Baptist University', 'Oklahoma Christian University', 'Oklahoma City University', 'Oklahoma Panhandle State University', 'Oklahoma State University', 'Oklahoma State University Center For Health Sciences', 'Oklahoma State University - Institute Of Technology', 'Oklahoma State University - Oklahoma City', 'Oklahoma State University - Tulsa', 'Old Dominion University', 'Olive-Harvey College', 'Olivet College', 'Olivet Nazarene University', "O'More College Of Design", 'Oral Roberts University', 'Oregon College Of Arts And Crafts', 'Oregon Graduate Institute Of Science And Technology', 'Oregon Health Sciences University', 'Oregon Institute Of Technology', 'Oregon State University', 'Otis College Of Art & Design', 'Ottawa University', 'Otterbein College', 'Ouachita Baptist University', 'Our Lady Of Holy Cross College', 'Our Lady Of The Lake University', 'Ozark Christian College', 'Pace University', 'Pace University  Pleasantville/Briarcliff', 'Pacifica Graduate Institute', 'Pacific College Of Oriental Medicine', 'Pacific Graduate School Of Psychology', 'Pacific Lutheran University', 'Pacific Northwest College Of Art', 'Pacific Oaks College', 'Pacific Union College', 'Pacific University', 'Paier College Of Art', 'Paine College', 'Palm Beach Atlantic University', 'Palm Beach State College', 'Palmer College Of Chiropractic', 'Palmer College Of Chiropractic West', 'Park College', 'Parsons School Of Design', 'Paul Quinn College', 'Peace College', 'Pebble Hills University', 'Pennsylvania Academy Of The Fine Arts', 'Pennsylvania College Of Optometry', 'Pennsylvania Institute Of Technology', 'Pennsylvania State University', 'Pennsylvania State University - Abington', 'Pennsylvania State University - Altoona', 'Pennsylvania State University At Erie - Behrend College', 'Pennsylvania State University At Harrisburg - The Capital College', 'Pennsylvania State University - Berks-Lehigh Valley College', 'Pennsylvania State University Delaware County', 'Pennsylvania State University Great Valley', 'Pennsylvania State University - Lehigh Valley', 'Pennsylvania State University - Milton S.Hershey Medical Center', 'Pennsylvania State University - Schuylkill', 'Pepperdine University', 'Peru State College', 'Pfeiffer University', 'Philadelphia College Of Bible', 'Philadelphia College Of Osteopathic Medicine', 'Philadelphia University', 'Philander Smith College', 'Phillips Graduate Institute', 'Phillips University', 'Piedmont Baptist College', 'Piedmont College', 'Pikeville College', 'Pillsbury Baptist Bible College', 'Pittsburg State University', 'Pitzer College', 'Plymouth State College', 'Point Loma Nazarene College', 'Point Park College', 'Polytechnic University', 'Polytechnic University, Long Island Campus', 'Polytechnic University, Westchester Graduate Center', 'Pomona College', 'Portland Community College', 'Portland State University', 'Post University Of Waterbury', 'Prairie View Agricultural And Mechanical University', 'Pratt Institute', 'Presbyterian College', 'Prescott College', 'Preston University', 'Princeton University', 'Principia College', 'Providence College', 'Puget Sound Christian College', 'Purdue University', 'Purdue University Calumet', 'Purdue University North Central', 'Quantum-Veritas International University', 'Queens College', 'Quincy University', 'Quinnipiac College', 'Radford University', 'Ramapo College Of New Jersey', 'Rand Graduate School Of Policy Studies', 'Randolph-Macon College', "Randolph-Macon Woman'S College", 'Rasmussen College', 'Rasmussen College, Florida Campuses', 'Rasmussen College, Illinois Campuses', 'Rasmussen College, Minnesota Campuses', 'Rasmussen College, North Dakota Campuses', 'Rasmussen College, Wisconsin Campuses', 'Reed College', 'Reformed Bible College', 'Regent International University', 'Regent University', 'Regis College', 'Regis University', 'Reinhardt College', 'Rensselaer Polytechnic Institute', 'Research College Of Nursing - Rockhurst University', 'Rhode Island College', 'Rhode Island School Of Design', 'Rhodes College', 'Rice University', 'Richard Stockton College Of New Jersey', 'Rider University', 'Ringling College Of Art And Design', 'Ripon College', 'Rivier College', 'Roanoke Bible College', 'Roanoke College', 'Robert Morris College', 'Robert Morris College Of Chicago', 'Roberts Wesleyan College', 'Rochester College', 'Rochester Institute Of Technology', 'Rockford College', 'Rockhurst College', 'Rock Valley College', 'Rocky Mountain College', 'Rocky Mountain College Of Art And Design', 'Rogers State University', 'Roger Williams University', 'Rollins College', 'Roosevelt University', 'Rose-Hulman Institute Of Technology', 'Rosemont College', 'Ross University, School Of Medicine', 'Rowan University', 'Rush University', 'Russel Sage College', 'Rust College', 'Rutgers, The State University Of New Jersey', 'Rutgers, The State University Of New Jersey - Camden', 'Rutgers, The State University Of New Jersey - Newark', 'Sacred Heart University', 'Sage Graduate School', 'Saginaw Valley State University', 'Salem College', 'Salem International University', 'Salem State College', 'Salem Teikyo University', 'Salisbury State University', 'Salve Regina University', 'Samford University', 'Sam Houston State University', 'Samuel Merritt College', 'San Diego State University', 'San Diego University For Integrative Studies', 'Sanford-Brown Institute', 'San Francisco Art Institute', 'San Francisco Conservatory Of Music', 'San Francisco State University', 'San Joaquin College Of Law', 'San Jose Christian College', 'San Jose State University', 'Santa Clara University', 'Sarah Lawrence College', 'Savannah College Of Art And Design', 'Savannah State University', 'Saybrook Institute', 'Schiller International University', 'Scholl College Of Podiatric Medicine', 'School For International Training', 'School Of The Museum Of Fine Arts', 'School Of The Visual Arts', 'Schreiner College', 'Scripps College', 'Seattle Pacific University', 'Seattle University', 'Seton Hall University', 'Seton Hill College', 'Shawnee Community College', 'Shawnee State University', 'Shaw University', 'Sheldon Jackson College', 'Shenandoah University', 'Shepherd College', 'Sherman College Of Straight Chiropractic', 'Shimer College', 'Shippensburg University Of Pennsylvania', 'Shoreline Community College', 'Shorter College', 'Siena College', 'Siena Heights University', 'Sierra Nevada College', 'Silver Lake College', 'Simmons College', "Simon'S Rock College", 'Simpson College', 'Simpson College Iowa', 'Sinte Gleska University', 'Skadron College', 'Skidmore College', 'Slippery Rock University', 'Smith College', 'Sojourner-Douglass College', 'Soka University Of America', 'Sonoma State University', 'South Carolina State University', 'South Dakota School Of Mines And Technology', 'South Dakota State University', 'Southeastern Baptist College', 'Southeastern Bible College', 'Southeastern College Of The Assemblies Of God', 'Southeastern Louisiana University', 'Southeastern Oklahoma State University', 'Southeastern University', 'Southeast Missouri State University', 'Southern Adventist University', 'Southern Arkansas University', 'Southern California College', 'Southern California College Of Optometry', 'Southern California Institute Of Architecture', 'Southern College Of Optometry', 'Southern Connecticut State University', 'Southern Illinois University At Carbondale', 'Southern Illinois University At Edwardsville', 'Southern Methodist University', 'Southern Nazarene University', 'Southern New Hampshire University', 'Southern Oregon University', 'Southern Polytechnic State Univerisity', 'Southern University - Baton Rouge', 'Southern University - New Orleans', 'Southern University - Shreveport', 'Southern Utah University', 'Southern Vermont College', 'Southern Wesleyan University', 'South Florida Bible College & Theological Seminary', 'South Texas College Of Law', 'Southwest Baptist University', 'Southwestern Adventist University', 'Southwestern Assemblies Of God University', 'Southwestern Baptist Theological Seminary', 'Southwestern Christian College', 'Southwestern Christian University', 'Southwestern College Kansas', 'Southwestern College Santa Fe', 'Southwestern Oklahoma State University', 'Southwestern University', 'Southwestern University School Of Law', 'Southwest Missouri State University', 'Southwest Missouri State University - West Plains', 'Southwest State University', 'Southwest Texas State University', 'Southwest University', 'Spalding University', 'Spelman College', 'Spertus Institute Of Jewish Studies', 'Spring Arbor College', 'Springfield College', 'Spring Hill College', 'St. Ambrose University', 'Standford Online University', 'Standford University', 'St. Andrews Presbyterian College', 'Stanford University', 'St. Anselm College', 'St. Anthony College Of Nursing', 'State University Of New York At Albany', 'State University Of New York At Binghamton', 'State University Of New York At Buffalo', 'State University Of New York At New Paltz', 'State University Of New York At Oswego', 'State University Of New York At Stony Brook', 'State University Of New York College At Brockport', 'State University Of New York College At Cortland', 'State University Of New York College At Fredonia', 'State University Of New York College At Geneseo', 'State University Of New York College At Old Westbury', 'State University Of New York College At Oneonta', 'State University Of New York College At Plattsburgh', 'State University Of New York College At Potsdam', 'State University Of New York College At Purchase', 'State University Of New York College Of Agriculture And Technology At Cobleskill', 'State University Of New York College Of Environmental Science And Forestry', 'State University Of New York College Of Optometry', 'State University Of New York College Of Technology At Alfred', 'State University Of New York College Of Technology At Farmingdale', 'State University Of New York Downstate Medical Center', 'State University Of New York Empire State College', 'State University Of New York Health Sience Centre Syracuse', 'State University Of New York Institute Of Technology At Utica/Rome', 'State University Of New York Maritime College', 'State University Of New York School Of Engineering And Applied Sciences', 'State University Of New York (Suny)', 'State University Of New York Upstate Medical University ', 'State University Of West Georgia', "St. Augustine'S College North Carolina", "St. Bernard'S Institute", 'St. Bonaventure University', 'St. Cloud State University', 'St. Edwards University', 'Stefan University', 'Stephen F. Austin State University', 'Stephens College', 'Sterling College', 'Stetson University', 'Stevens Institute Of Technology', 'St. Francis College, Brooklyn Heights', 'St. Francis College, Fort Wayne', 'St. Francis College, Loretto', 'St. Francis Medical Center College Of Nursing', "St. George'S University", 'Stillman College', 'St. John Fisher College', "St. John'S College Maryland", "St. John'S College New Mexico", "St. John'S Seminary", "St. John'S University", 'St. Joseph College', 'St. Joseph College Of Nursing', "St. Joseph'S College", "St. Joseph'S College New York", "St. Joseph'S College New York, Suffolk Campus", "St. Joseph'S College Of Maine", "St. Joseph'S University", 'St. Lawrence University', 'St. Leo College', 'St. Louis Christian College', 'St. Louis College Of Pharmacy', 'St. Louis University', "St. Luke'S College", "St. Martin'S College", 'St. Mary College', 'St. Mary-Of-The-Woods College', "St. Mary'S College Indiana", "St. Mary'S College Of California", "St. Mary'S College Of Maryland", "St. Mary'S University Of Minnesota", "St. Mary'S University Of San Antonio", 'St. Meinrad College', "St. Michael'S College", 'St. Norbert College', 'St. Olaf College', 'Stonehill College', "St. Paul'S College", 'St. Petersburg College', "St. Peter'S College", 'Strayer University', 'St. Thomas Aquinas College', 'St. Thomas University', 'St. Vincent College', 'St. Xavier University', 'Suffolk University', 'Sullivan College', 'Sul Ross State University', 'Susquehanna University', 'Swarthmore College', 'Sweet Briar College', 'Syracuse University', 'Tabor College', 'Talladega College', 'Tarleton State University', 'Taylor University', 'Taylor University, Fort Wayne Campus', 'Teachers College, Columbia University', 'Temple University', 'Temple University School Of Podiatric Medicine', 'Tennessee State University', 'Tennessee Technological University', 'Tennessee Temple University', 'Tennessee Wesleyan College', 'Texas A&M International University', 'Texas A&M University', 'Texas A&M University - Commerce', 'Texas A&M University - Corpus Christi', 'Texas A&M University - Galveston', 'Texas A&M University - Kingsville', 'Texas A&M University - Texarkana', 'Texas Chiropractic College', 'Texas Christian University', 'Texas College', 'Texas College Of Osteopathic Medicine', 'Texas Lutheran University', 'Texas Southern University', 'Texas Tech University', 'Texas Tech University Health Science Center', 'Texas Wesleyan University', "Texas Woman'S University", 'The American College', 'The Art Institute Of Boston', 'The Art Institutes International Portland', 'The Art Institutes International San Francisco', 'The Boston Conservatory', 'The Catholic University Of America', 'The Chicago School Of Professional Psychology', 'The College Of Insurance', 'The College Of New Jersey', 'The College Of Santa Fe', 'The College Of St. Scholastica', 'The College Of Westchester', 'The College Of Wooster', 'The Cooper Union For The Advancement Of Science And Art', 'The Corcoran College Of Art', 'The Curtis Institute Of Music', 'The Defiance College', 'The Dickinson School Of Law', 'The Illinois Institute Of Art-Chicago', 'The Johns Hopkins University', 'The Juilliard School', 'The Leadership Institute Of Seattle', 'The Maryland Institute, College Of Art', "The Master'S College", 'The Mcgregor School Of Antioch University', 'The Naropa Institute', 'The New School', 'The Rockefeller University', 'The School Of The Art Institute Of Chicago', 'The Scripps Research Institute', 'The Southern Christian University', 'The Tulane University Of New Orleans', 'The Union Institute', 'Thiel College', 'Thomas A. Edison State College', 'Thomas Aquinas College', 'Thomas College Maine', 'Thomas Jefferson University', 'Thomas More College', 'Thomas More College Of Liberal Arts', 'Thomas University', 'Thunderbird School Of Global Management', 'Tiffin University', 'Toccoa Falls College', 'Tomball College', 'Tougaloo College', 'Touro College', 'Touro University', 'Towson University', 'Transylvania University', 'Trevecca Nazarene University', 'Tri-College University', 'Trident University', 'Trinity Bible College', 'Trinity Christian College', 'Trinity College Connecticut', 'Trinity College Of Florida', 'Trinity College Of Vermont', 'Trinity International University', 'Trinity International University (Excel), Miami', 'Trinity University', 'Trinity University', 'Tri-State University', 'Triton College', 'Troy University', 'Troy University, Dothan', 'Troy University, Montgomery', 'Troy University, Phenix City', 'Troy University, Troy', 'Truman College', 'Truman State University', 'Tufts University', 'Tui Online University', 'Tusculum College', 'Tuskegee University', 'Uniformed Services Universty Of The Health Sciences', 'Union College', 'Union College Kentucky', 'Union College Nebraska', 'Union Theological Seminary (Uts)', 'Union University', 'United States Air Force Academy', 'United States Coast Guard Academy', 'United States International University', 'United States Merchant Marine Academy', 'United States Military Academy', 'United States Naval Academy', 'United States Sports Academy', 'Unity College', 'University Of Advancing Technology (Uat)', 'University Of Akron', 'University Of Alabama - Birmingham', 'University Of Alabama - Huntsville', 'University Of Alabama - Tuscaloosa', 'University Of Alanta', 'University Of Alaska - Anchorage', 'University Of Alaska - Fairbanks', 'University Of Alaska - Southeast', 'University Of Alaska (System)', 'University Of Arizona', 'University Of Arkansas At Fayetteville', 'University Of Arkansas At Little Rock', 'University Of Arkansas At Monticello', 'University Of Arkansas At Pine Bluff', 'University Of Arkansas For Medical Sciences', 'University Of Arkansas (System)', 'University Of Baltimore', 'University Of Bridgeport', 'University Of California, Berkeley', 'University Of California, Davis', 'University Of California, Hastings College Of Law', 'University Of California, Irvine', 'University Of California, Los Angeles', 'University Of California, Merced', 'University Of California, Oakland', 'University Of California, Riverside', 'University Of California, San Diego', 'University Of California, San Francisco', 'University Of California, Santa Barbara', 'University Of California, Santa Cruz', 'University Of California System', 'University Of Central Arkansas', 'University Of Central Florida', 'University Of Central Missouri', 'University Of Central Oklahoma', 'University Of Central Texas', 'University Of Charleston', 'University Of Charleston South Carolina', 'University Of Chicago', 'University Of Cincinnati', 'University Of Colorado At Boulder', 'University Of Colorado At Colorado Springs', 'University Of Colorado At Denver', 'University Of Colorado Health Sciences Center', 'University Of Connecticut', 'University Of Connecticut At Avery Point', 'University Of Connecticut At Hartford', 'University Of Connecticut At Stamford', 'University Of Connecticut At Waterbury', 'University Of Connecticut Health Center', 'University Of Dallas', 'University Of Dayton', 'University Of Delaware', 'University Of Denver', 'University Of Detroit Mercy', 'University Of Dubuque', 'University Of Evansville', 'University Of Findlay', 'University Of Florida', 'University Of Georgia', 'University Of Great Falls', 'University Of Hartford', 'University Of Hawaii - Hilo', 'University Of Hawaii - Manoa', 'University Of Hawaii - System', 'University Of Hawaii - West Oahu', 'University Of Health Sciences', 'University Of Houston', 'University Of Houston, Clear Lake', 'University Of Houston, Downtown', 'University Of Houston, Victoria', 'University Of Idaho', 'University Of Illinois', 'University Of Illinois At Chicago', 'University Of Illinois At Springfield', 'University Of Illinois At Urbana-Champaign', 'University Of Indianapolis', 'University Of Iowa', 'University Of Kansas', 'University Of Kentucky', 'University Of La Verne', 'University Of Louisiana At Lafayette', 'University Of Louisiana At Monroe', 'University Of Louisville', 'University Of Maine, Augusta', 'University Of Maine, Farmington', 'University Of Maine, Fort Kent', 'University Of Maine, Machias', 'University Of Maine, Orono', 'University Of Maine, Presque Isle', 'University Of Maine (System)', 'University Of Management & Technology', 'University Of Mary', 'University Of Mary Hardin-Baylor', 'University Of Maryland At Baltimore', 'University Of Maryland At College Park', 'University Of Maryland Baltimore County', 'University Of Maryland Eastern Shore', 'University Of Maryland Medicine', 'University Of Maryland (System)', 'University Of Maryland University College', 'University Of Massachusetts At Amherst', 'University Of Massachusetts At Boston', 'University Of Massachusetts At Dartmouth', 'University Of Massachusetts At Lowell', 'University Of Massachusetts Medical Center At Worcester', 'University Of Massachusetts (System)', 'University Of Medicine And Dentistry Of New Jersey', 'University Of Memphis', 'University Of Miami', 'University Of Michigan - Ann Arbor', 'University Of Michigan - Dearborn', 'University Of Michigan - Flint', 'University Of Minnesota - Crookston', 'University Of Minnesota - Duluth', 'University Of Minnesota - Morris', 'University Of Minnesota - Twin Cities Campus', 'University Of Mississippi', 'University Of Mississippi Medical Center', 'University Of Missouri - Columbia', 'University Of Missouri - Kansas City', 'University Of Missouri - Saint Louis', 'University Of Mobile', 'University Of Montana', 'University Of Montana Western', 'University Of Montevallo', 'University Of Nebraska - Kearney', 'University Of Nebraska - Lincoln', 'University Of Nebraska Medical Center', 'University Of Nebraska - Omaha', 'University Of Nebraska (System)', 'University Of Nevada - Las Vegas', 'University Of Nevada - Reno', 'University Of New England', 'University Of New England, Westbrook College Campus', 'University Of New Hampshire', 'University Of New Hampshire - Manchester', 'University Of New Haven', 'University Of New Mexico', 'University Of New Orleans', 'University Of North Alabama', 'University Of North America', 'University Of North Carolina At Asheville', 'University Of North Carolina At Chapel Hill', 'University Of North Carolina At Charlotte', 'University Of North Carolina At Greensboro', 'University Of North Carolina At Pembroke', 'University Of North Carolina At Wilmington', 'University Of North Dakota', 'University Of Northern Colorado', 'University Of Northern Iowa', 'University Of Northern Virginia', 'University Of Northern Washington', 'University Of North Florida', 'University Of North Texas', 'University Of North Texas Health Science Center At Fort Worth', 'University Of Northwest', 'University Of Notre Dame', 'University Of Oklahoma', 'University Of Oklahoma Health Sciences Center', 'University Of Oregon', 'University Of Osteopathic Medicine And Health Science', 'University Of Pennsylvania', 'University Of Phoenix', 'University Of Pittsburgh', 'University Of Pittsburgh At Bradford', 'University Of Pittsburgh At Greensburg', 'University Of Pittsburgh At Johnstown', 'University Of Portland', 'University Of Puget Sound', 'University Of Redlands', 'University Of Rhode Island', 'University Of Richmond', 'University Of Rio Grande', 'University Of Rochester', 'University Of San Diego', 'University Of San Francisco', 'University Of Science And Arts Of Oklahoma', 'University Of Scranton', 'University Of Sioux Falls', 'University Of South Alabama', 'University Of South Carolina', 'University Of South Carolina - Aiken', 'University Of South Carolina - Beaufort', 'University Of South Carolina - Lancaster', 'University Of South Carolina - Salkehatchie', 'University Of South Carolina - Spartanburg', 'University Of South Carolina - Sumter', 'University Of South Carolina - Union', 'University Of South Dakota', 'University Of Southern California', 'University Of Southern Indiana', 'University Of Southern Maine', 'University Of Southern Mississippi', 'University Of South Florida', 'University Of St. Francis', 'University Of St. Thomas, Houston', 'University Of St. Thomas, St. Paul', 'University Of Tampa', 'University Of Tennessee - Chattanooga', 'University Of Tennessee - Knoxville', 'University Of Tennessee - Martin', 'University Of Tennessee - Memphis', 'University Of Tennessee Space Institute', 'University Of Texas', 'University Of Texas At Arlington', 'University Of Texas At Austin', 'University Of Texas At Brownsville', 'University Of Texas At Dallas', 'University Of Texas At El Paso', 'University Of Texas At San Antonio', 'University Of Texas At Tyler', 'University Of Texas Health Center At Houston', 'University Of Texas Health Center At Tyler', 'University Of Texas Health Science Center At San Antonio', 'University Of Texas M.D. Anderson Cancer Center', 'University Of Texas Medical Branch Galveston', 'University Of Texas Of The Permian Basin', 'University Of Texas Pan American', 'University Of Texas Southwestern Medical Center At Dallas', 'University Of The Arts', 'University Of The District Of Columbia', 'University Of The Incarnate World', 'University Of The Ozarks', 'University Of The Pacific', 'University Of The Sciences In Philadelphia', 'University Of The South', 'University Of The Southwest', 'University Of Toledo', 'University Of Tulsa', 'University Of Utah', 'University Of Vermont', 'University Of Virginia', 'University Of Virginia, College At Wise', 'University Of Washington', 'University Of Washington, Tacoma', 'University Of West Alabama', 'University Of West Florida', 'University Of West Los Angeles', 'University Of Wisconsin - Eau Claire', 'University Of Wisconsin - Green Bay', 'University Of Wisconsin - La Crosse', 'University Of Wisconsin - Madison', 'University Of Wisconsin - Milwaukee', 'University Of Wisconsin - Oshkosh', 'University Of Wisconsin - Parkside', 'University Of Wisconsin - Platteville', 'University Of Wisconsin - River Falls', 'University Of Wisconsin - Stevens Point', 'University Of Wisconsin - Stout', 'University Of Wisconsin - Superior', 'University Of Wisconsin - Whitewater', 'University Of Wyoming', 'Upper Iowa University', 'Urbana University', 'Ursinus College', 'Ursuline College', 'Utah State University', 'Utah Valley State College', 'Utica College', 'Valdosta State University', 'Valley City State University', 'Valley Forge Christian College', 'Valparaiso University', 'Vanderbilt University', 'Vandercook College Of Music', 'Vanguard University Of Southern California', 'Vassar College', 'Vennard College', 'Vermont Law School', 'Vermont Technical College', 'Villa Julie College', 'Villanova University', 'Virginia College', 'Virginia Commonwealth University', 'Virginia Intermont College', 'Virginia International University', 'Virginia Military Institute', 'Virginia Polytechnic Institute And State University (Virginia Tech)', 'Virginia State University', 'Virginia Union University', 'Virginia Wesleyan College', 'Viterbo College', 'Voorhees College', 'Wabash College', 'Wagner College', 'Wake Forest University', 'Walden University', 'Walla Walla College', 'Walsh College Of Accountancy And Business Administration', 'Walsh University', 'Warner Pacific College', 'Warner Southern College', 'Warren Wilson College', 'Wartburg College', 'Washburn University', 'Washington And Lee University', 'Washington Bible College', 'Washington College', 'Washington State University', 'Washington State University, Spokane', 'Washington State University, Tri-Cities', 'Washington State University, Vancouver', 'Washington University In St. Louis', 'Wayland Baptist University', 'Waynesburg College', 'Wayne State College', 'Wayne State University', 'Webber College', 'Webb Institute', 'Weber State University', 'Webster University', 'Webster University North Florida', 'Weill Medical College Of Cornell University', 'Wellesley College', 'Wells College', 'Wentworth Institute Of Technology', 'Wesleyan College', 'Wesleyan University', 'Wesley College', 'Wesley College Mississippi', 'Westbrook University ', 'West Chester University Of Pennsylvania', 'West Coast University', 'Western Baptist College', 'Western Bible College', 'Western Carolina University', 'Western Connecticut State University', 'Western Governors University', 'Western Illinois University', 'Western International University', 'Western Kentucky University', 'Western Maryland College', 'Western Michigan University', 'Western New England College', 'Western New Mexico University', 'Western Oregon University', 'Western State College', 'Western States Chiropractic College', 'Western State University College Of Law', 'Western State University College Of Law - Orange County', 'Western Washington University', 'Westfield State College', 'West Liberty State College', 'Westminster College Fulton', 'Westminster College New Wilmington', 'Westminster College Of Salt Lake City', 'Westmont College', 'West Suburban College Of Nursing', 'West Texas A&M University', 'West Virginia School Of Osteopathic Medicine', 'West Virginia State College', 'West Virginia University', 'West Virginia University Institute Of Technology', 'West Virginia Wesleyan College', 'Westwood College', 'Wheaton College Massachusetts', 'Wheeling Jesuit University', 'Wheelock College', 'Whitman College', 'Whittier College', 'Whitworth College', 'Wichita State University', 'Widener University', 'Wilberforce University', 'Wilbur Wright College', 'Wiley College', 'Wilkes University', 'Willamette University', 'William Carey College', 'William Jewell College', 'William Mitchell College Of Law', 'William Paterson University', 'William Penn College', 'Williams Baptist College', 'Williams College', 'William Tyndale College', 'William Woods University', 'Wilmington College', 'Wilmington College', 'Wilson College', 'Wingate University', 'Winona State University', 'Winston-Salem State University', 'Winthrop University', 'Wisconsin Lutheran College', 'Wisconsin School Of Professional Psychology', 'Wittenberg University', 'Wofford College', 'Woodbury University', 'Worcester Polytechnic Institute', 'Worcester State College', 'Wright Institute', 'Wright State University', 'Xavier University', 'Xavier University Of Louisiana', 'Yale University', 'Yeshiva University', 'York College Nebraska', 'York College Of Pennsylvania', 'Yorker International University', 'York University', 'Youngstown State University']

    const handleJobTypeSelect = (jobType) => {
        setSelectedJobTypes(prevSelectedJobTypes => {
            if (prevSelectedJobTypes.includes(jobType)) {
                return prevSelectedJobTypes.filter(item => item !== jobType);
            } else {
                return [...prevSelectedJobTypes, jobType];
            }
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isAuthenticated && user) {
                    const userData = await getUserData(user.email);
                    // Ensure industries is always an array
                    const industries = Array.isArray(userData.industry) ? userData.industry : [];
                    setSelectedJobTypes(industries);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [isAuthenticated, user]);

    const navigate = useNavigate();

    const variables = [
        { key: '[their_first_name]', description: "Recipient's first name" },
        { key: '[their_last_name]', description: "Recipient's last name" },
        { key: '[first_name]', description: "Your first name" },
        { key: '[last_name]', description: "Your last name" },
        { key: '[year_in_school]', description: "Grade level (i.e., freshman)" },
        { key: '[university]', description: "Your school's name" },
        { key: '[relevant_industry]', description: "Recipient industry (i.e. investment banking)" },
        { key: '[their_company]', description: "Recipient's company (i.e. Goldman Sachs)" },
    ];

    const copyToClipboard = async (text, variableKey) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopyStatus(prevStatus => ({ ...prevStatus, [variableKey]: true }));

            setTimeout(() => {
                setCopyStatus(prevStatus => ({ ...prevStatus, [variableKey]: false }));
            }, 1000); // Reset the status after 2 seconds
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    const submitToDB = async () => {
        const subscription = "0";
        const industry = selectedJobTypes;
        const paragraph_coffee_chat = coffee_chat_email;
        const paragraph_network = recruiting_email;
        const total_position_notifications = 0;
        const signup_timestamp = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')} ${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}:${new Date().getSeconds().toString().padStart(2, '0')}`;
        const ref_utm_param = new URLSearchParams(window.location.search).get('utm');
        const custom_university = editableUniversity;
        let emails_to_send = [];

        if (onboardStep == 1) {
            setCoffeeChatEmail(`Dear [their_first_name], \n\nMy name is [first_name] and I’m a [year_in_school] at [university]. I’m reaching out to ask if you’d be interested in meeting at some point? I’m trying to learn more about the [relevant_industry] industry and would love to hear about your experiences at [their_company]. \n\nThanks,\n[first_name] [last_name]`)
            setRecruitingEmail(`Dear [their_first_name], \n\nMy name is [first_name] and I’m a [year_in_school] at [university]. I’m reaching out to ask if you’d be interested in meeting at some point? I’m trying to learn more about the [relevant_industry] industry and would love your insight on the topic. \n\nThanks,\n[first_name] [last_name]`)
            setParagraphSubjectLine(`Student Reaching out From ${editableUniversity}`)
        }

        if (onboardStep === 3) {
            setIsSubmitting(true)
            console.log(industry)
            if (industry.length > 1) {
                const l1 = await getRandomCompanies(industry[0]);
                const l2 = await getRandomCompanies(industry[1]);
                emails_to_send = l1.concat(l2);
            } else if (industry.length == 1) {
                const l1 = await getRandomCompanies(industry[0]);
                const l2 = await getRandomCompanies(industry[0]);
                emails_to_send = l1.concat(l2);
            }

            if (emails_to_send.length == 0) {
                emails_to_send = await getRandomCompanies("Software Engineering");
            }

            const userInformation = "Roles:" + selectedJobTypes + "\n\n" + "Source:"+ user_origin;
            const num_unsent_emails = emails_to_send.length;

            const templateParams = {
                name: user.name,
                email: user.email,
                subject: 'New User Signup',
                message: userInformation,
            };

            try {
                await emailjs.send(
                    process.env.REACT_APP_SERVICE_ID,
                    'template_39jskwb',
                    templateParams,
                    process.env.REACT_APP_PUBLIC_KEY
                );
                reset();
            } catch (e) {
                console.error(e);
                alert('Failed to send the message, please try again.');
            }

            const userData = {
                first_name,
                last_name,
                university,
                custom_university,
                year_in_school,
                industry,
                subscription,
                paragraph_coffee_chat,
                paragraph_network,
                total_position_notifications,
                signup_timestamp,
                user_origin,
                emails_to_send,
                paragraph_subject_line,
                num_unsent_emails
            };

            try {
                await upsertUser(user.email, userData);
                navigate('/dashboard');
            } catch (error) {
                console.error('Error submitting to DB:', error);
            }

            try {
                let apiGatewayEndpointOnboard = "https://ylqm1lgeud.execute-api.us-east-1.amazonaws.com/dev/onboarding-email"
                try {
                    const onboardResponse = await fetch(apiGatewayEndpointOnboard, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            client_email: user?.email
                        })
                    });

                    console.log(onboardResponse)

                } catch (error) {
                    console.error('An error occurred:', error);
                }
            } catch (error) {
                console.error('Error sending onboarding email: ', error);
            }

        } else {
            nextOnboardStep();
        }
    };

    const nextOnboardStep = () => {
        setOnboardStep(onboardStep + 1)
    }

    const goBackOnboardStep = () => {
        setOnboardStep(onboardStep - 1)
    }

    let onboardStepContent;

    if (onboardStep == 0) {
        onboardStepContent =
            <div className="space-y-6 max-w-md mx-auto md:max-w-lg lg:max-w-xl">
                <h1 className='font-medium text-[32px] md:text-[30px] lg:text-[40px] tracking-tight leading-tight md:leading-snug lg:leading-[115%]'>Let's get started</h1>
                <p className="text-md mt-4">Let's start with filling out some basic information about yourself.</p>
                <div className="flex flex-wrap -mx-2">
                    <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                        <input
                            className='w-full border border-gray-300 rounded-md py-2 px-4'
                            placeholder='First name'
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-2">
                        <input
                            className='w-full border border-gray-300 rounded-md py-2 px-4'
                            placeholder='Last name'
                            value={last_name}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>
                <select
                    className='border border-gray-300 rounded-md py-2 px-4 w-full mb-4'
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                >
                    {!schoolList.includes(university) && <option value="" disabled>Select your university</option>}
                    {schoolList.map((school, index) => (
                        <option key={index} value={school}>
                            {school}
                        </option>
                    ))}
                    <option value="Other">Other</option>
                </select>
                {university && (
                    <div>
                        <p className='mb-4'>Adjust university name or enter it if not listed.</p>
                        <input
                            type='text'
                            className='border border-gray-300 rounded-md py-2 px-4 w-full text-gray-500'
                            value={editableUniversity} // Bind the input value to the editableUniversity state
                            onChange={handleChange} // Set up the onChange event handler
                        ></input>
                    </div>
                )}
                <select
                    className='border border-gray-300 rounded-md py-2 px-4 w-full'
                    aria-label='Year in school'
                    value={year_in_school}
                    onChange={(e) => setYearInSchool(e.target.value)}
                >
                    <option value="" disabled hidden>Year in school</option>
                    <option value="freshman">Freshman</option>
                    <option value="sophomore">Sophomore</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                </select>
                {
                    first_name && last_name && university && year_in_school ? (
                        <button
                            className="w-full md:w-auto border px-10 py-2 border-black rounded-full bg-black text-white font-medium mt-4"
                            onClick={submitToDB}
                        >
                            Continue
                        </button>
                    ) : null
                }
            </div >
    }
    else if (onboardStep == 1) {
        onboardStepContent = (
            <div className="space-y-6">
                <h1 className='font-medium text-[32px] md:text-[30px] lg:text-[40px] tracking-tight leading-tight md:leading-snug lg:leading-[115%]'>
                    Pick your industries
                </h1>
                <p className="text-md">
                    Select industries you're interested in working in.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div
                        className="max-sm:text-xs text-sm max-sm:py-3 hover:cursor-pointer border border-black rounded-md py-2 flex justify-center items-center"
                        onClick={() => handleJobTypeSelect('Software Engineering')}
                        style={{ backgroundColor: selectedJobTypes.includes('Software Engineering') ? 'black' : 'transparent' }}
                    >
                        <span className={selectedJobTypes.includes('Software Engineering') ? 'text-white' : 'text-gray-600'}>
                            Software Engineering
                        </span>
                    </div>

                    <div
                        className="max-sm:text-xs text-sm max-sm:py-3 hover:cursor-pointer border border-black rounded-md py- flex justify-center items-center"
                        onClick={() => handleJobTypeSelect('Product Management')}
                        style={{ backgroundColor: selectedJobTypes.includes('Product Management') ? 'black' : 'transparent' }}
                    >
                        <span className={selectedJobTypes.includes('Product Management') ? 'text-white' : 'text-gray-600'}>
                            Product Management
                        </span>
                    </div>
                    <div
                        className="max-sm:text-xs text-sm max-sm:py-3 hover:cursor-pointer border border-black rounded-md py-2 flex justify-center items-center"
                        onClick={() => handleJobTypeSelect('Investment Banking')}
                        style={{ backgroundColor: selectedJobTypes.includes('Investment Banking') ? 'black' : 'transparent' }}
                    >
                        <span className={selectedJobTypes.includes('Investment Banking') ? 'text-white' : 'text-gray-600'}>
                            Investment Banking
                        </span>
                    </div>
                    <div
                        className="max-sm:text-xs text-sm max-sm:py-3 hover:cursor-pointer border border-black rounded-md py-2 flex justify-center items-center"
                        onClick={() => handleJobTypeSelect('Product Design')}
                        style={{ backgroundColor: selectedJobTypes.includes('Product Design') ? 'black' : 'transparent' }}
                    >
                        <span className={selectedJobTypes.includes('Product Design') ? 'text-white' : 'text-gray-600'}>
                            Product Design
                        </span>
                    </div>
                    <div
                        className="max-sm:text-xs text-sm max-sm:py-3 hover:cursor-pointer border border-black rounded-md py-2 flex justify-center items-center"
                        onClick={() => handleJobTypeSelect('Venture Capital')}
                        style={{ backgroundColor: selectedJobTypes.includes('Venture Capital') ? 'black' : 'transparent' }}
                    >
                        <span className={selectedJobTypes.includes('Venture Capital') ? 'text-white' : 'text-gray-600'}>
                            Venture Capital
                        </span>
                    </div>
                    <div
                        className="max-sm:text-xs text-sm max-sm:py-3 hover:cursor-pointer border border-black rounded-md py-2 flex justify-center items-center"
                        onClick={() => handleJobTypeSelect('Consulting')}
                        style={{ backgroundColor: selectedJobTypes.includes('Consulting') ? 'black' : 'transparent' }}
                    >
                        <span className={selectedJobTypes.includes('Consulting') ? 'text-white' : 'text-gray-600'}>
                            Consulting
                        </span>
                    </div>
                </div>
                {selectedJobTypes.length >= 1 ? (
                    <div>
                        <button
                            className="border px-10 py-2 border-black rounded-full bg-black text-white font-medium mr-3"
                            onClick={submitToDB}
                        >
                            Continue
                        </button>
                        <button
                            className="border px-10 py-2 border-black rounded-full text-black font-medium"
                            onClick={goBackOnboardStep}
                        >
                            Back
                        </button>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        );
    }
    else if (onboardStep == 2) {
        onboardStepContent = (
            <div className="space-y-6 pt-0">
                <h1 className='font-medium text-[32px] md:text-[30px] lg:text-[40px] tracking-tight leading-tight md:leading-snug lg:leading-[115%]'>Email template</h1>
                <p className='py-3'>Click on the variables below to add custom fields to your clipboard. This will be sent to people that you're looking to connect with.</p>
                <textarea
                    className='w-full border border-gray-300 rounded-md pt-4 pb-4 px-4'
                    rows="2"
                    value={paragraph_subject_line}
                    onChange={(e) => setParagraphSubjectLine(e.target.value)}
                />
                <textarea
                    className='w-full border border-gray-300 rounded-md pt-4 pb-4 px-4'
                    rows="10"
                    value={coffee_chat_email}
                    onChange={(e) => setCoffeeChatEmail(e.target.value)}
                />

                <button className="border px-10 py-2 border-black rounded-full bg-black text-white font-medium mr-3" onClick={submitToDB}>Use template</button>
                <button className="border px-10 py-2 border-black rounded-full text-black font-medium" onClick={goBackOnboardStep}>Back</button>
                {/*                 
                <div className="flex flex-wrap gap-2 my-2">
                    {variables.map((variable, index) => (
                        <button
                            key={index}
                            className="flex items-center bg-gray-200 hover:bg-gray-300 text-black rounded px-4 py-2"
                            onClick={(e) => copyToClipboard(variable.key, variable.key)}
                            type="button"
                        >
                            <FiCopy className="ml-2" />
                            <span className="ml-2 text-xs">{copyStatus[variable.key] ? 'Copied!' : variable.description}</span>
                        </button>
                    ))}
                </div>
                */}

            </div>
        );
    }
    else if (onboardStep == 3) {
        onboardStepContent = (
            <div className="space-y-6 pt-0">
                <h1 className='font-medium text-[32px] md:text-[30px] lg:text-[40px] tracking-tight leading-tight md:leading-snug lg:leading-[115%]'>Where'd you hear about Superday?</h1>
                <p className='py-3'>Let us know where you first heard about our platform. It helps a lot and allows us to bring you the best internship recruiting tools.</p>

                <select
                    className='border border-gray-300 rounded-md py-2 px-4 w-full'
                    aria-label='Year in school'
                    value={user_origin}
                    onChange={(e) => setUserOrigin(e.target.value)}
                >
                    <option value="" disabled hidden>How'd you hear about us?</option>
                    <option value="linkedin_profile">LinkedIn Profile</option>
                    <option value="friend">Another student or friend</option>
                    <option value="email">Outreach through email</option>
                    <option value="other">Other</option>
                </select>

                {isSubmitting ? (
                    <button className="border px-10 py-2 border-black rounded-full bg-black text-white font-medium mr-3" disabled>
                        Creating Account...
                    </button>
                ) : (
                    user_origin ? (
                        <button className="border px-10 py-2 border-black rounded-full bg-black text-white font-medium mr-3" onClick={submitToDB}>
                            Create Account
                        </button>
                    ) : null
                )}
                <button className="border px-10 py-2 border-black rounded-full text-black font-medium" onClick={goBackOnboardStep}>Back</button>
                {/* 
                                
                <div className="flex flex-wrap gap-2 my-2">
                    {variables.map((variable, index) => (
                        <button
                            key={index}
                            className="flex items-center bg-gray-200 hover:bg-gray-300 text-black rounded px-4 py-2"
                            onClick={(e) => copyToClipboard(variable.key, variable.key)}
                            type="button"
                        >
                            <FiCopy className="ml-2" />
                            <span className="ml-2 text-xs">{copyStatus[variable.key] ? 'Copied!' : variable.description}</span>
                        </button>
                    ))}
                </div>
                */}

            </div>
        );
    }

    {/*
    else if (onboardStep == 2) {
        onboardStepContent = <div className="space-y-6 pt-32">
            <h1 className='font-medium text-[32px] md:text-[30px] lg:text-[40px] tracking-tight leading-tight md:leading-snug lg:leading-[115%]'>Recruiting template</h1>
            <p className='py-5'>Click on the variables below to add custom fields to your clipboard. This will be sent to people that you're looking to recruit with. </p>

            <textarea
                className='w-full border border-gray-300 rounded-md pt-4 pb-4 px-4'
                rows="10"
                value={recruiting_email} // Bind the textarea to the coffeeChatEmail state
                onChange={(e) => setRecruitingEmail(e.target.value)} // Update state on change
            />
            <button className="border px-10 py-2 border-black rounded-full bg-black text-white font-medium mr-3" onClick={submitToDB}>Use template</button>
            <button className="border px-10 py-2 border-black rounded-full text-black font-medium" onClick={goBackOnboardStep}>Back</button>

            <div className="flex flex-wrap gap-2 my-2">
                {variables.map((variable, index) => (
                    <button
                        key={index}
                        className="flex items-center bg-gray-200 hover:bg-gray-300 text-black rounded px-4 py-2"
                        onClick={(e) => copyToClipboard(variable.key, variable.key)}
                        type="button"
                    >
                        <FiCopy className="ml-2" />
                        <span className="ml-2 text-xs">{copyStatus[variable.key] ? 'Copied!' : variable.description}</span>
                    </button>
                ))}
            </div>
        </div>
    }*/}

    return (
        <div className="flex flex-col items-center justify-center h-screen relative w-full">
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
                <div className="relative w-full h-[250px] md:h-full max-h-screen">
                    <div className='bg-black py-4 absolute bottom-0 w-full flex items-center justify-center z-30'>
                        <div className='flex items-center justify-center'>
                            <img className="h-[23px]" src={WhiteLogo}></img>
                            <h1 className="text-white text-[25px] ml-3">Superday</h1>
                        </div>
                    </div>
                    <img src={InternExampleVertical} alt="Intern Example" className="absolute w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-center bg-[#f8fbff] py-12 overflow-auto">
                    <div className="w-full max-w-lg px-6">
                        {onboardStepContent}
                    </div>
                </div>
            </div>
        </div >
    );
}