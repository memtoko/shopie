// ref http://www.html5rocks.com/en/tutorials/file/dndfiles/
import Ember from 'ember';

let {RSVP, $} = Ember;

export default Ember.Mixin.create({

  /**
  read the file input and return array of File
  */
  getSingleFileInput(input) {
    return new RSVP.Promise((resolve, reject) => {
      input = $(input);
      var entries = input.prop('webkitEntries') || input.prop('entries'),
        files,
        value;
      if (entries && entries.length) {
        resolve(this._getFileTreeEntries(entries));
      }

      files = $.makeArray(input.prop('files'));
      if (!files.length) {
        value = input.prop('value');
        if (!value) {
          return reject('Not a file.');
        }
        // If the files property is not available, the browser does not
        // support the File API and we add a pseudo File object with
        // the input value as name with path information removed:
        files = [{name: value.replace(/^.*\\/, '')}];
      } else if (files[0].name === undefined && files[0].fileName) {
        $.each(files, function (index, file) {
          file.name = file.fileName;
          file.size = file.fileSize;
        });
      }
      resolve(files);
    });
  },

  getFilesInput(input) {
    if (!(input instanceof $) || input.length === 1) {
      return this.getSingleFileInput(input);
    }
    return RSVP.all($.map(input, this.getSingleFileInput)).then(function (files) {
      return Array.prototype.concat.apply([], files);
    });
  },

  getDroppedFiles(dataTransfer) {
    dataTransfer = dataTransfer || {};
    let items = dataTransfer.items;
    if (items && items.length && (items[0].webkitGetAsEntry || items[0].getAsEntry)) {
      let params = $.map(items, (item) => {
        var entry;
        if (item.webkitGetAsEntry) {
          entry = item.webkitGetAsEntry();
          if (entry) {
            entry._file = item.getAsFile();
          }
          return entry;
        }
        return item.getAsEntry();
      });
      return RSVP.resolve(this._getFileTreeEntries(params));
    }
    return RSVP.resolve($.makeArray(dataTransfer.files));
  },

  _getFileTreeEntries(entries, path) {
    console.log(entries);
    return RSVP.all(
      $.map(entries, (entry) => this._getFileTreeEntry(entry, path))
    ).then(function (files) {
      return Array.prototype.concat.apply([], files);
    });
  },

  _getFileTreeEntry(entry, path) {
    return new RSVP.Promise((resolve, reject) => {
      var errorHandler = function (e) {
        if (e && !e.entry) {
          e.entry = entry;
        }
        reject(e);
      };
      path = path || '';
      if (entry.isFile) {
        if (entry._file) {
          entry._file.relativePath = path;
          resolve(entry._file);
        } else {
          entry.file((file) => {
            file.relativePath = path;
            resolve(file);
          }, errorHandler);
        }
      } else if(entry.isDirectory) {
        let dirReader = entry.createReader();
        dirReader.readEntries((entries) => {
          this._getFileTreeEntries(entries).then((files) => {
            resolve(files);
          }).catch(errorHandler);
        }, errorHandler);
      } else {
        reject('it not directory or files.');
      }
    });
  }
});
