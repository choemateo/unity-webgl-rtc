@extends('layouts.dashboardLayout')
@section('content')
    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <h2>Meeting Users</h2>
      <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Room Name</th>
              <th scope="col">User Name</th>
              <th scope="col">Character</th>
              <th scope="col">type</th>
              <th scope="col">status</th>
            </tr>
          </thead>
          <tbody>
          <?php $i = 1;?>
              @foreach($rooms as $user)
             <tr>
                  <td>{{$i}}</td>
                  <td>{{$user->spacename}}</td>
                  <td>{{$user->username}}</td>
                  <td>{{$user->avatar}}</td>
                  <td>{{$user->type}}</td>
                  <td>{{$user->state}}</td>
              </tr>
             <?php $i++; ?>
              @endforeach
          </tbody>
        </table>
      </div>
    </main>
@endsection
