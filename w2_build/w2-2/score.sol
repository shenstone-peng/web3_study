// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

contract Score{
    mapping(address=>mapping(string=>uint256)) database;
    mapping(address=>string) teacherAccount;
    address head_teacher;
    constructor(){
        head_teacher = msg.sender;
    }
    modifier onlyTeacher(string memory class_name){
        string memory tmp = teacherAccount[msg.sender];
        require(keccak256(abi.encodePacked((tmp))) == keccak256(abi.encodePacked((class_name))),"u can't set score");
        _;
    }
    modifier onlyHeadTeacher(){
        require(msg.sender == head_teacher,"only head_teacher can add teacher!");
        _;
    }
    event setScoreResult(
        address indexed teacher,
        address indexed student,
        uint256 score,
        uint256 time
    );
    event addTeacherLog(
        address indexed teacher,
        string class_name
    );
    function setScore(address _student, uint256 _score, string memory class_name)  public onlyTeacher(class_name){
        require(_score <=100, "score must be lower than 101!");
        database[_student][class_name] = _score;
        emit setScoreResult(msg.sender, _student, _score, block.timestamp);
    }
    function getScore(address _student, string memory class_name) view public returns(uint256){
        return database[_student][class_name];
    }
    function addTeacher(address _teacher, string memory class_name) public onlyHeadTeacher{
        teacherAccount[_teacher] = class_name;
        emit addTeacherLog(_teacher, class_name);
    }
}



