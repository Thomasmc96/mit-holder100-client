import React, { useState, useEffect } from 'react';
import './SpecificTask.css';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import globalConsts from '../../globalConsts';
import Loader from 'react-loader-spinner';

import {
  Button,
  Input,
  Label,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from 'reactstrap';

const SpecificTask = () => {
  const [taskText, setTaskTest] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const { state } = useLocation();
  // console.log(state.tags);

  const toggleModalSuccess = () => {
    setModalSuccess(!modalSuccess);
    // if (modalSuccess) {
    //   window.location = '/home';
    // }
  };

  var deadlineColor = '';
  if (state.due_date !== null) {
    var deadline = new Date(parseInt(state.due_date));
    var deadlineFormat = deadline.toISOString().slice(0, 10).toString();
    if (deadline <= new Date()) {
      deadlineColor = 'red';
    }
  }

  useEffect(() => {
    if (!selectedFile) {
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviews((prevState) => {
      return [...prevState, objectUrl];
    });
  }, [selectedFile]);

  const onSelectFile = (e) => {
    const fileObject = e.target.files[0];
    if (!fileObject || fileObject.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(fileObject);
    setSelectedFiles((prevState) => {
      // selectedFiles: [...prevState, fileObject],
      return [...prevState, fileObject];
    });
  };

  const onFileRemove = (fileName, previewName) => {
    URL.revokeObjectURL(previewName);
    setSelectedFile();

    setSelectedFiles((prevState) => {
      return prevState.filter((file) => file.name !== fileName);
    });
    setPreviews((prevState) => {
      return prevState.filter((preview) => preview !== previewName);
    });
  };

  // Attaching a comment field onto the file object
  const handleFileComment = (value, index) => {
    let files = [...selectedFiles];
    let file = files[index];
    file.comment = value;
    files[index] = file;
    setSelectedFiles(files);
  };

  const handleTags = (e, tagIndex, fileIndex, bgColor) => {
    const tagObject = {
      id: e.target.value + tagIndex + fileIndex,
      value: e.target.value,
      tagIndex: tagIndex,
      fileIndex: fileIndex,
    };
    var inArray = false;

    if (selectedTags.length > 0) {
      for (let i = 0; i < selectedTags.length; i++) {
        if (
          selectedTags[i].value +
            selectedTags[i].tagIndex +
            selectedTags[i].fileIndex ===
          tagObject.id
        ) {
          inArray = true;
          e.target.style.borderColor = bgColor;
          setSelectedTags((prevState) => {
            return prevState.filter((tag) => tag.id !== tagObject.id);
          });
        }
        if (selectedTags[i].fileIndex === tagObject.fileIndex) {
          let files = [...selectedFiles];
          let file = files[fileIndex];
          let tagsArray = [file.tags];
          tagsArray.push(selectedTags[i]);
          file.tags = tagsArray;
          files[fileIndex] = file;
          setSelectedFiles(files);
        }
      }
    }
    if (!inArray) {
      e.target.style.borderColor = 'yellow';
      setSelectedTags((prevState) => {
        return [...prevState, tagObject];
      });
    }
    console.log(selectedFiles);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const headers = {
      'Content-Type': 'multipart/form-data',
    };

    const commentData = new FormData();
    commentData.append('taskId', state.id);
    commentData.append('comment_text', taskText);
    commentData.append('status', state.status.status);

    if (state.assignees.length > 0) {
      commentData.append('assignee', state.assignees[0].id);
    }
    axios({
      method: 'POST',
      url: `${globalConsts[0]}/tasks/addComment.php`,
      data: commentData,
    })
      .then((result) => {
        // console.log(result);

        setTaskTest('');
        if (selectedFiles.length > 0) {
          const fileData = new FormData();
          fileData.append('taskId', state.id);
          for (let i = 0; i < selectedFiles.length; i++) {
            fileData.append('file[]', selectedFiles[i], selectedFiles[i].name);
            fileData.append('comment[]', selectedFiles[i].comment);
          }
          if (state.assignees.length > 0) {
            fileData.append('assignee', state.assignees[0].id);
          }
          axios({
            method: 'POST',
            url: `${globalConsts[0]}/tasks/addAttachments.php`,
            data: fileData,
            headers: headers,
          })
            .then((result) => {
              if (result.status === 200) {
                // console.log(result);
                setSelectedFiles([]);
                setPreviews([]);
                setSelectedFile();
                setLoading(false);
                toggleModalSuccess();
              }
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
            });
        } else {
          toggleModalSuccess();
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div className="contentWrapper contentCenter ">
      <Form onSubmit={handleSubmit} method="POST">
        <FormGroup>
          <div className="taskWrapper listHeader">
            {/* <h4 className=" mb-3">Opgaven</h4> */}
            <div className="taskContent">
              <h5>{state.name}</h5>
              <p className="taskDeadline" style={{ color: deadlineColor }}>
                {state.due_date !== null
                  ? 'Deadline: ' + deadlineFormat
                  : 'Ingen deadline'}
              </p>
              <p className="taskDescription">{state.description}</p>
            </div>
            {/* <h4 className="mb-3 mt-4">Din løsning</h4> */}
            <div className="taskContent mt-3">
              <h5>Tilføj en tekst</h5>
              <Input
                type="textarea"
                value={taskText}
                placeholder="Tilføj en tekst til opgaven"
                required
                style={{ minHeight: 100 }}
                onChange={(event) => setTaskTest(event.target.value)}
              />
            </div>

            {selectedFiles !== '' &&
              selectedFiles.map((file, index) => (
                <div key={index} className="taskContent mt-3">
                  <h5>Fil {index + 1}</h5>
                  {selectedFiles[index] &&
                    (selectedFiles[index].type === 'image/jpeg' ||
                      selectedFiles[index].type === 'image/jpg' ||
                      selectedFiles[index].type === 'image/svg+xml' ||
                      selectedFiles[index].type === 'image/gif' ||
                      selectedFiles[index].type === 'image/png') && (
                      <Row>
                        <Col className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 col-12 fileCol">
                          <img
                            src={previews[index]}
                            className="imagePreview"
                            alt="En valgt fil"
                          />
                        </Col>
                        <Col className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 col-12 fileCol">
                          <Input
                            type="textarea"
                            placeholder="Tilføj en kommentar til filen"
                            className="fileComment"
                            onChange={(e) =>
                              handleFileComment(e.target.value, index)
                            }
                          />
                        </Col>
                      </Row>
                    )}
                  <Row>
                    <Col>
                      <p>{selectedFiles[index] && selectedFiles[index].name}</p>
                    </Col>
                    <Col>
                      {state.tags.map((tag, tagIndex) => (
                        <button
                          type="button"
                          key={tagIndex}
                          className="tagStyles"
                          value={tag.name}
                          onClick={(e) =>
                            handleTags(e, tagIndex, index, tag.tag_bg)
                          }
                          style={{
                            backgroundColor: tag.tag_bg,
                            borderColor: tag.tag_bg,
                          }}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </Col>
                  </Row>
                  <Button
                    className="removeFileBtn"
                    onClick={() => onFileRemove(file.name, previews[index])}
                  >
                    Slet
                  </Button>
                </div>
              ))}

            <div className="taskContent mt-3">
              <h5>Tilføj en fil</h5>
              <Label className="fileLabel" for="selectedFile">
                Vælg fil
              </Label>
              <Input
                id="selectedFile"
                type="file"
                name="selectedFile"
                className="fileInput"
                onChange={onSelectFile}
                onClick={(e) => (e.target.value = null)} // Setting value to null so the same file can be picked more than once in a row
              />
            </div>
            <div className="taskButtonDiv">
              <Button className="taskButton">
                {loading ? (
                  <Loader
                    type="TailSpin"
                    color="white"
                    height={23}
                    width={23}
                  />
                ) : (
                  'Indsend'
                )}
              </Button>
            </div>
          </div>
        </FormGroup>
      </Form>
      <Modal isOpen={modalSuccess} toggle={toggleModalSuccess}>
        <ModalHeader toggle={toggleModalSuccess}>Succes!</ModalHeader>
        <ModalBody>
          Tak for dit svar. Din besvarelse er blevet indsendt til Holder 100.
        </ModalBody>
        <ModalFooter>
          <Link to={'/home'}>
            <Button className="closeModal" onClick={toggleModalSuccess}>
              Luk
            </Button>{' '}
          </Link>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default SpecificTask;
